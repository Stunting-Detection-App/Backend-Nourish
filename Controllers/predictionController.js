const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

//POST method Prediction
const predict = (req, res) => {
    const { age, gender, height } = req.body;

    // Validasi input
    if (!age || age <= 0 || !Number.isInteger(Number(age))) {
        return res.status(400).json({ error: true, message: 'Invalid age' });
    }
    if (!['male', 'female'].includes(gender)) {
        return res.status(400).json({ error: true, message: 'Invalid gender' });
    }
    if (!height || height <= 0) {
        return res.status(400).json({ error: true, message: 'Invalid height' });
    }
    // Cari index dengan nilai terbesar
    const resultIndex = predictions.indexOf(Math.max(...predictions));
    // Mapping index ke string klasifikasi
    const classification = [
      "Severely Stunted",
      "Stunted",
      "Normal",
      "High"
    ];

    const result = classification[resultIndex] || "Unknown"; // Mengambil hasil klasifikasi
    const description = result === "Severely Stunted" ? "A" :
                        result === "Stunted" ? "B" :
                        result === "Normal" ? "C" :
                        result === "High" ? "D" :
                        "Description unavailable";
  
    // Simpan hasil ke database
    const userId = req.user.userId;
    const predictionId = uuidv4();
    const query = `
      INSERT INTO predictions (prediction_id, user_id, age, gender, height, prediction, result, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      predictionId,
      userId,
      age,
      gender,
      height,
      JSON.stringify(predictions),
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


// GET Method History Prediction
const getHistory = (req, res) => {
  const userId = req.user.userId;
  const query = `
    SELECT prediction_id, age, gender, height, prediction, result, description, created_at
    FROM predictions
    WHERE user_id = ? 
    ORDER BY created_at DESC
    `;

    const values = [userId]
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({
            error: false,
            message: 'No prediction history found',
            history: []
        });
      }

      const formattedResults = results.map(result => ({
        prediction_id: result.prediction_id,
        age: result.age,
        gender: result.gender,
        height: result.height,
        result: result.result,
        description: result.description,
        created_at: result.created_at
    }));
  
      res.status(200).json({
        error: false,
        message: 'Prediction history fetched successfully',
        history: formattedResults ,
      });
    });
  };
  
  module.exports = { predict, getHistory };
