const db = require('../config/db');
const { uploadToGcs } = require('../middleware/uploadImage');


// Add New Story
const addStory = (req, res) => {
    const { description, lat, lon } = req.body;
    const photoUrl = req.file?.cloudStoragePublicUrl;

    if (!description || !photoUrl) {
        return res.status(400).json({ error: true, message: 'Description and photo are required' });
    }

    const query = 
        `INSERT INTO journals (user_id, photo_url, description, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?)`;
    const values = [req.user.userId, photoUrl, description, lat || null, lon || null];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({ error: false, message: 'success' });
    });
};

// Add New Story dengan guest account
const addStoryGuest = (req, res) => {
    const { description, lat, lon } = req.body;
    const photoUrl = req.file?.cloudStoragePublicUrl;

    if (!description || !photoUrl) {
        return res.status(400).json({ error: true, message: 'Description and photo are required' });
    }

    const query = `
        INSERT INTO journals (user_id, photo_url, description, latitude, longitude) 
        VALUES (NULL, ?, ?, ?, ?)`;
    const values = [photoUrl, description, lat || null, lon || null];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({ error: false, message: 'success' });
    });
};

// Get All Stories
const getAllStories = (req, res) => {
    const { page = 1, size = 10, location = 0 } = req.query;
    const offset = (page - 1) * size;

    let query = `
        SELECT journals_id, user_id, photo_url, description, latitude, longitude, created_at 
        FROM journals 
        LIMIT ?, ?`;
    const values = [offset, parseInt(size)];

    if (location == 1) {
        query = `
            SELECT journals_id, user_id, photo_url, description, latitude, longitude, created_at 
            FROM journals 
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL 
            LIMIT ?, ?`;
    }

    db.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
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
    addStory,
    addStoryGuest,
    getAllStories,
    getStoryDetail,
};