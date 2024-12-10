const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { uploadToGcs } = require('../middleware/uploadImage');
const {
    createJournal,
    createJournalByGuest,
    getAllStories,
    getStoryDetail
} = require('../Controllers/journalsController');

router.post('/', authenticate, upload.single('file'), uploadToGcs, createJournal);
router.post('/guest', upload.single('photo'), uploadToGcs, createJournalByGuest);
router.get('/', getAllStories);
router.get('/:journals_id', getStoryDetail);

module.exports = router;
