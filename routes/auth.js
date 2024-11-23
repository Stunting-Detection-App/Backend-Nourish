const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// Registration
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    // Hash password menggunakan bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }
      // insert user ke db
      const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
  
        res.status(200).json({ message: 'User registered successfully!' });
      });
    });
  });

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // find user
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Compare password with the hash stored in the database
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Error comparing passwords' });
        }
  
        if (isMatch) {
          // Create JWT token if password is correct
          const token = jwt.sign({ userId: result[0].user_id }, 'your_jwt_secret', { expiresIn: '1h' });
  
          // Insert the token into the sessions table
          const insertSessionQuery = 'INSERT INTO sessions (user_id, token) VALUES (?, ?)';
          db.query(insertSessionQuery, [result[0].user_id, token], (err, sessionResult) => {
            if (err) {
              return res.status(500).json({ error: 'Error creating session' });
            }
  
            res.status(200).json({ message: 'Login successful', token });
          });
        } else {
          res.status(400).json({ error: 'Invalid credentials' });
        }
      });
    });
  });

// logout
router.delete('/logout', authenticate, (req, res) => {
  const token = req.header('Authorization');

  // Delete the session token from the database
  const deleteSessionQuery = 'DELETE FROM sessions WHERE token = ?';
  db.query(deleteSessionQuery, [token], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

router.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  // Verify the refresh token
  jwt.verify(refreshToken, 'your_refresh_token_secret', (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid refresh token' });
    }
    // Generate a new JWT token
    const newToken = jwt.sign({ userId: decoded.userId }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ newToken });
  });
});

router.get('/verify-session', authenticate, (req, res) => {
  // If the user is authenticated (via the authenticate middleware), send their profile data or any info.
  res.status(200).json({ message: 'Session is valid', userId: req.user.userId });
});

module.exports = router
