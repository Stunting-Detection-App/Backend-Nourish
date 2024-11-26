const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validasi input
  if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
          error: true,
          message: 'Invalid input. Password must be at least 8 characters long.'
      });
  }

  // Hash password menggunakan bcrypt
  bcrypt.hash(password, 8, (err, hashedPassword) => {
      if (err) {
          return res.status(500).json({ error: true, message: 'Error hashing password' });
      }

      // Cek apakah email sudah ada di database
      const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
      db.query(checkEmailQuery, [email], (err, result) => {
          if (err) {
              return res.status(500).json({ error: true, message: 'Database error' });
          }
          if (result.length > 0) {
              return res.status(400).json({ error: true, message: 'Email already registered' });
          }

          // Insert user ke database
          const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
          db.query(insertQuery, [name, email, hashedPassword], (err) => {
              if (err) {
                  return res.status(500).json({ error: true, message: 'Database error' });
              }

              // Respons sukses
              res.status(201).json({
                  error: false,
                  message: 'User Created'
              });
          });
      });
  });
});


// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
      return res.status(400).json({
          error: true,
          message: 'Invalid input. Email and password are required.'
      });
  }

  // Cari user berdasarkan email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
      if (err) {
          return res.status(500).json({ error: true, message: 'Database error' });
      }
      if (result.length === 0) {
          return res.status(404).json({ error: true, message: 'User not found' });
      }

      // Validasi password
      bcrypt.compare(password, result[0].password, (err, isMatch) => {
          if (err || !isMatch) {
              return res.status(400).json({ error: true, message: 'Invalid credentials' });
          }

          // Buat token JWT
          const token = jwt.sign(
              { userId: result[0].user_id, name: result[0].username },
              'your_jwt_secret',
              { expiresIn: '1h' }
          );

          // Simpan token ke tabel sessions
          const insertSessionQuery = 'INSERT INTO sessions (user_id, token) VALUES (?, ?)';
          db.query(insertSessionQuery, [result[0].user_id, token], (err) => {
              if (err) {
                  return res.status(500).json({ error: true, message: 'Error creating session' });
              }

              // Respons sukses
              res.status(200).json({
                  error: false,
                  message: 'success',
                  loginResult: {
                      userId: result[0].user_id,
                      name: result[0].username,
                      token
                  }
              });
          });
      });
  });
});



// logout >> pindah di profile page
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
