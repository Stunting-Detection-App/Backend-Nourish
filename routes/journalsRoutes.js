const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToGcs } = require('../middleware/uploadImage');
const {
    addStory,
    addStoryGuest,
    getAllStories,
    getStoryDetail
} = require('../Controllers/journalsController');
const authenticate = require('../middleware/authenticate');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 },
});


router.post('/stories', authenticate, upload.single('photo'), uploadToGcs, addStory);
router.post('/stories/guest', upload.single('photo'), uploadToGcs, addStoryGuest);
router.get('/stories', getAllStories);
router.get('/stories/:journals_id', getStoryDetail);

module.exports = router;
