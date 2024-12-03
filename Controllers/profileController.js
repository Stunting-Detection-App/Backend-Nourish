const db = require('../config/db');

// Get Profile
const getProfile = (req, res) => {
    const userId = req.user.userId;
  
    const query = 'SELECT user_id, username, email, created_at, updated_at FROM users WHERE user_id = ?';
    db.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: true, message: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
  
      res.status(200).json({
        error: false,
        profile: result[0],
      });
    });
  };
  

  // Update Profile
  const updateProfile = (req, res) => {
    const userId = req.user.userId;
    const { name, email } = req.body;
  
    const query = 'UPDATE users SET username = ?, email = ? WHERE user_id = ?';
    db.query(query, [name, email, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: true, message: 'Database error' });
      }
  
      res.status(200).json({
        error: false,
        message: 'Profile updated successfully',
      });
    });
  };
  
  
  // Delete Profile
const deleteProfile = (req, res) => {
    const userId = req.user.userId;
  
    // Delete user from users table
    const deleteUserQuery = 'DELETE FROM users WHERE user_id = ?';
    db.query(deleteUserQuery, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: true, message: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
  
      // Optionally, delete any related sessions (if exists)
      const deleteSessionQuery = 'DELETE FROM sessions WHERE user_id = ?';
      db.query(deleteSessionQuery, [userId], (err) => {
        if (err) {
          return res.status(500).json({ error: true, message: 'Error deleting session' });
        }
  
        res.status(200).json({
          error: false,
          message: 'Profile deleted successfully',
        });
      });
    });
  };
  
  module.exports = {
    getProfile,
    updateProfile,
    deleteProfile
  };
