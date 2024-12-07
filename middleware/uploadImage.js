'use strict';
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
//const fs = require('fs');
//const path = require('path');
// const dateFormat = require('dateformat');
const dayjs = require('dayjs');
//const pathKey = path.resolve('./config/serviceaccountkey.json');

/*const gcs = new Storage({
    projectId: 'capstone-project-441809',
    keyFilename: pathKey,
});*/

const gcs = new Storage()
const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadToGcs = (req, res, next) => {
    if (!req.file) return next();

    // Validasi ukuran file
    if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds the 10MB limit.' });
    }

    // Validasi tipe file 
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
    }
    
    //const gcsname = `${dateFormat(new Date(), 'yyyymmdd-HHMMss')}-${req.file.originalname}`;
    const gcsname = `${dayjs().format('YYYYMMDD-HHmmss')}-${req.file.originalname}`;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    // Tangani error saat upload
    stream.on('error', (err) => {
        req.file.cloudStorageError = err;
        next(err);
    });

    // Tangani proses selesai upload
    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
        next();
    });

    stream.end(req.file.buffer);
};

module.exports = { uploadToGcs };