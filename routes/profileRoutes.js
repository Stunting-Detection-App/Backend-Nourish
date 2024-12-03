const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../Controllers/profileController');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, getProfile);
router.put('/', authenticate, updateProfile);
router.delete('/', authenticate, deleteProfile);

module.exports = router;