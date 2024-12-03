const db = require('../config/db');
const axios = require('axios');

// POST method Prediction
exports.predict = async (req, res) => {
    const { age, gender, height } = req.body;

    // Validasi input
    if (!age || !gender || !height) {
        return res.status(400).json({ message: 'All fields are required (age, gender, height)' });
    }

    try {
        // Panggil API model ML
        const mlResponse = await axios.post(process.env.ML_API_URL, { age, gender, height });

        // Ambil hasil prediksi dari API ML
        const prediction = mlResponse.data.prediction; // Contoh: [0, 1, 0, 0]

        // Simpan data ke database
        const query = `INSERT INTO predictions (age, gender, height, prediction) VALUES (?, ?, ?, ?)`;
        const values = [age, gender, height, JSON.stringify(prediction)];
        db.query(query, values, (err, result) => {
            if (err) throw err;

            // Berikan respon ke frontend
            return res.status(201).json({
                message: 'Prediction successful',
                prediction,
                prediction_id: result.insertId
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error processing prediction' });
    }
};


// GET Method History Prediction
exports.getHistory = (req, res) => {
    const query = `SELECT * FROM predictions ORDER BY created_at DESC`;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving prediction history' });
        }

        // Format hasil agar lebih user-friendly
        const formattedResults = results.map((result) => ({
            id: result.id,
            age: result.age,
            gender: result.gender,
            height: result.height,
            prediction: JSON.parse(result.prediction),
            created_at: result.created_at
        }));

        return res.status(200).json(formattedResults);
    });
};
