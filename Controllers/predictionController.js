const db = require('../config/db');
const tf = require('@tensorflow/tfjs-node');

// Path ke model
const modelPath = process.env.MODEL_PATH;

// POST method Prediction
const predict = (req, res) => {
    const { age, gender, height } = req.body;
    const predictions = req.predictionResult; // Array hasil prediksi dari model
  
    if (!predictions || !Array.isArray(predictions)) {
      return res.status(400).json({ error: true, message: 'Invalid prediction result' });
    }
  
    // Cari index dengan nilai terbesar
    const resultIndex = predictions.indexOf(Math.max(...predictions));
  
    // Mapping index ke string klasifikasi
    const classification = [
      "Severely Stunted",
      "Stunted",
      "Normal",
      "High",
    ];
    const result = resultIndex >= 0 ? classification[resultIndex] : "Unknown";
  
    // Simpan hasil ke database
    const query = `
      INSERT INTO predictions (user_id, age, gender, height, prediction)
      VALUES (?, ?, ?, ?, ?)`;
    const values = [
      req.user.userId, // ID user dari token
      age,
      gender,
      height,
      JSON.stringify({ predictions, result }), // Simpan array prediksi dan hasilnya
    ];
  
    db.query(query, values, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: 'Database error' });
      }
  
      res.status(201).json({
        error: false,
        message: 'Prediction saved successfully',
        result: {
          classification: result,
          probabilities: predictions,
        },
      });
    });
  };


// GET Method History Prediction
const getHistory = (req, res) => {
    const query = `
      SELECT id, age, gender, height, prediction, created_at
      FROM predictions
      WHERE user_id = ? 
      ORDER BY created_at DESC`;
    const values = [req.user.userId];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: 'Database error' });
      }
  
      res.status(200).json({
        error: false,
        message: 'Prediction history fetched successfully',
        history: results,
      });
    });
  };
  
  module.exports = { predict, getHistory };
