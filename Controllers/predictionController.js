const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

//POST method Prediction
const predict = (req, res) => {
  const { age, gender, height, result, description } = req.body;
  if (!age || !gender || !height || !result || !description) {
    return res.status(400).json({ error: true, message: 'Invalid input' });
  }
  const predictionId = uuidv4();
  const userId = req.user.userId;
  const query = `
      INSERT INTO predictions (prediction_id, user_id, age, gender, height, result, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
      predictionId,
      userId,
      age,
      gender,
      height,
      result,
      description
  ];

  db.query(query, values, (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: true, message: 'Database error' });
      }

      res.status(201).json({
          error: false,
          message: 'Prediction saved successfully',
      });
  });
};

// GET History Prediction
const getHistory = (req, res) => {
  const query = `SELECT prediction_id, age, gender, height, result, description, user_id, created_at FROM predictions`;

  db.query(query, [journals_id], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: true, message: 'Database error' });
      }

      res.status(200).json({
          error: false,
          message: 'Prediction history fetched successfully',
          data: results
      });
  });
};
  
  module.exports = { predict, getHistory };
