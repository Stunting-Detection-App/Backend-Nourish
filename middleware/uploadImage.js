'use strict';
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');
const pathKey = path.resolve('./config/serviceaccountkey.json');

const gcs = new Storage({
    projectId: '<projectid>',
    keyFilename: pathKey,
});

const bucketName = '<bucket-name>';
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${bucketName}/${filename}`;
}

const uploadToGcs = (req, res, next) => {
    if (!req.file) return next();
    const gcsname = `${dateFormat(new Date(), 'yyyymmdd-HHMMss')}-${req.file.originalname}`;
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