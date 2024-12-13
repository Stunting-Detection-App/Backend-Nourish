const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createJournal = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: true, message: 'Image file is required' });
    }
    const { description, latitude, longitude } = req.body;
    const photoUrl = req.file.cloudStoragePublicUrl;

    if (!description || description.trim() === '') {
        return res.status(400).json({ error: true, message: 'Description is required' });
    }

    const journalId = uuidv4();
    const userId = req.user.userId;

    const query = `
        INSERT INTO journals (journals_id, user_id, photo_url, description, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        journalId,
        userId,
        photoUrl,
        description,
        latitude || null,
        longitude || null,
    ];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        // Mengirimkan respons berhasil
        res.status(201).json({
            error: false,
            message: 'Journal created successfully',
            journalId: journalId
        });
    });
};

const createJournalByGuest = (req, res) => {
    // Cek apakah ada token yang valid (untuk pengguna terautentikasi)
    const userId = req.user ? req.user.userId : 'guest_' + uuidv4();

    const { description, lat, lon } = req.body;
    const photoUrl = req.file ? req.file.cloudStoragePublicUrl : null;

    if (!req.file) {
        return res.status(400).json({ error: true, message: 'Image file is required' });
    }
    if (!description || description.trim() === '') {
        return res.status(400).json({ error: true, message: 'Description is required' });
    }

    const journalId = uuidv4();
    const query = `
        INSERT INTO journals (journals_id, user_id, description, photo_url, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        journalId,
        userId,
        description,
        photoUrl,
        lat || null,
        lon || null
    ];
    db.query(query, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({
            error: false,
            message: 'success',
        });
    });
};

// Get All Stories
const getAllStories = (req, res) => {
    const userId = req.user.userId;
    const query = `
        SELECT journals_id, user_id, photo_url, description, latitude, longitude, created_at 
        FROM journals 
        WHERE user_id = ?`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: true, message: 'No stories found' });
        }

        res.status(200).json({
            error: false,
            message: 'Stories fetched successfully',
            listStory: results,
        });
    });
};

// Get Detail Story
const getStoryDetail = (req, res) => {
    const { journals_id } = req.params;

    const query = `
        SELECT journals_id, user_id, photo_url, description, latitude, longitude, created_at 
        FROM journals 
        WHERE journals_id = ?`;
    db.query(query, [journals_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: true, message: 'Story not found' });
        }

        res.status(200).json({
            error: false,
            message: 'Story fetched successfully',
            story: result[0],
        });
    });
};

module.exports = {
    createJournal,
    createJournalByGuest,
    getAllStories,
    getStoryDetail
};