const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Register
const register = (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password || password.length < 8) {
      console.error('Validation failed: Missing fields or invalid password');
      return res.status(400).json({
        error: true,
        message: 'Invalid input. Password must be at least 8 characters long.',
      });
    }

    bcrypt.hash(password, 8, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({
            error: true,
            message: 'Error hashing password',
          });
        }
    
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], (err, result) => {
          if (err) {
            console.error('Error checking email in database:', err);
            return res.status(500).json({
              error: true,
              message: 'Database error during email check',
            });
          }
    
          if (result.length > 0) {
            console.warn(`Email already registered: ${email}`);
            return res.status(400).json({
              error: true,
              message: 'Email already registered',
            });
          }
          const userId = uuidv4();
          const insertQuery = 'INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)';
          db.query(insertQuery, [userId, name, email, hashedPassword], (err) => {
            if (err) {
              console.error('Error inserting user into database:', err);
              return res.status(500).json({
                error: true,
                message: 'Database error during user creation',
              });
            }
    
            console.log('User registered successfully:', email);
            res.status(201).json({
              error: false,
              message: 'User Created',
            });
          });
        });
      });
    };


// Login
const login = (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Invalid input. Email and password are required.',
      });
    }
  
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: true, message: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
  
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing password:', err);
          return res.status(500).json({ error: true, message: 'Server error' });
        }
        if (!isMatch) {
          return res.status(400).json({ error: true, message: 'Invalid credentials' });
        }
  
        const token = jwt.sign(
          { userId: result[0].user_id, name: result[0].username },
          process.env.JWT_SECRET,
          { expiresIn: '1y' }
        );
        const sessionId = uuidv4();
        const insertSessionQuery = 'INSERT INTO sessions (sessi_id, user_id, token) VALUES (?, ?, ?)';
        db.query(insertSessionQuery, [sessionId, result[0].user_id, token], (err) => {
          if (err) {
            return res.status(500).json({ error: true, message: 'Error creating session' });
          }
  
          res.status(200).json({
            error: false,
            message: 'success',
            loginResult: {
              userId: result[0].user_id,
              name: result[0].username,
              token,
            },
          });
        });
      });
    });
  };
  
module.exports = {
    register,
    login
};