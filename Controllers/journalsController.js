const db = require('../config/db');
//const { uploadToGcs } = require('../middleware/uploadImage');
const { v4: uuidv4 } = require('uuid');


// Add New Story
/*const addStory = (req, res) => {
    // Cek apakah file ada di request
    if (!req.file) {
        return res.status(400).json({ error: true, message: 'File upload failed' });
    }

    // Panggil fungsi uploadToGcs untuk meng-upload file ke Google Cloud Storage
    uploadToGcs(req.file, (err, photoUrl) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Failed to upload image to GCS' });
        }

        // Mendapatkan data dari body request
        const photoUrl = req.file?.cloudStoragePublicUrl;
        const { description, lat, lon } = req.body;

        // Validasi deskripsi dan URL foto
        if (!description || !photoUrl) {
            return res.status(400).json({ error: true, message: 'Description and photo are required' });
        }

        // Query untuk memasukkan data ke database
        const journalsId = uuidv4();
        const query = `
            INSERT INTO journals (journals_id, user_id, photo_url, description, latitude, longitude) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [journalsId, req.user.userId, photoUrl, description, lat || null, lon || null];

        // Simpan data ke database
        db.query(query, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: true, message: 'Database error' });
            }
        
            //console.log('Inserted record with ID:', result.insertId);
            res.status(201).json({
                error: false,
                message: 'Story added successfully',
                journalId: journalsId
            });
        });
    });
};*/
/*const addStory = (req, res) => {
    // Ambil data dari request
    const photoUrl = req.file?.cloudStoragePublicUrl;
    const { description, lat, lon } = req.body;

    // Validasi data
    if (!description || !photoUrl) {
        return res.status(400).json({ error: true, message: 'Description and photo are required' });
    }

    // Query untuk memasukkan data ke database
    const journalsId = uuidv4();
    const query = `
        INSERT INTO journals (journals_id, user_id, photo_url, description, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [journalsId, req.user.userId, photoUrl, description, lat || null, lon || null];

    // Simpan data ke database
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({
            error: false,
            message: 'Story added successfully',
            journalId: journalsId,
        });
    });
};*/

// Add New Story
/*const addStory = (req, res) => {
    const userId = req.user.userId;
    // Memastikan file telah diupload ke GCS
    console.log("addStory called");
    if (!req.file) {
        return res.status(400).json({ error: true, message: 'File upload failed' });
    }

    // Panggil fungsi uploadToGcs untuk upload ke GCS
    uploadToGcs(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: true, message: 'Failed to upload image to GCS' });
        }

        // Setelah file diupload, ambil URL foto
        const photoUrl = req.file?.cloudStoragePublicUrl;
        const { description, lat, lon } = req.body;

        // Validasi data
        if (!description || !photoUrl) {
            return res.status(400).json({ error: true, message: 'Description and photo are required' });
        }

        // Query untuk memasukkan data ke database
        const journalsId = uuidv4();
        const query = `
            INSERT INTO journals (journals_id, user_id, photo_url, description, latitude, longitude) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [journalsId, userId, photoUrl, description, lat || null, lon || null];

        // Simpan data ke database
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: true, message: 'Database error' });
            }

            res.status(201).json({
                error: false,
                message: 'Story added successfully',
                journalId: journalsId,
            });
        });
    });
};*/

const addStory = (req, res) => {
    const userId = req.user.userId;
    // Memastikan file telah diupload ke GCS
    console.log("addStory called");
    /*if (!req.file || !req.file.cloudStoragePublicUrl) {
        return res.status(400).json({ error: true, message: 'File upload failed' });
    }*/

    // Setelah file diupload, ambil URL foto
    const photoUrl = req.file.cloudStoragePublicUrl;
    const { description, lat, lon } = req.body;

    // Validasi data
    if (!photoUrl || !description) {
        return res.status(400).json({ error: true, message: 'Description and photo are required' });
    }

    // Query untuk memasukkan data ke database
    const journalsId = uuidv4();
    const query = `
        INSERT INTO journals (journals_id, user_id, photo_url, description, latitude, longitude) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [journalsId, userId, photoUrl, description, lat || null, lon || null];

    // Simpan data ke database
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({
            error: false,
            message: 'Story added successfully',
            journalId: journalsId,
            photoUrl: photoUrl,
        });
    });
};



// Add New Story dengan guest account
/*const addStoryGuest = (req, res) => {
    const { description, lat, lon } = req.body;
    const photoUrl = req.file?.cloudStoragePublicUrl;

    if (!description || !photoUrl) {
        return res.status(400).json({ error: true, message: 'Description and photo are required' });
    }

    const query = `
        INSERT INTO journals (photo_url, description, latitude, longitude) 
        VALUES (NULL, ?, ?, ?, ?)`;
    const values = [photoUrl, description, lat || null, lon || null];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: true, message: 'Database error' });
        }

        res.status(201).json({ error: false, message: 'success' });
    });
};*/

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
    getAllStories,
    getStoryDetail,
};