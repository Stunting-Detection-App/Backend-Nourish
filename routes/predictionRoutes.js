const express = require('express');
const router = express.Router();
const { predict, getHistory } = require('../Controllers/predictionController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, predict);
router.get('/', authenticate, getHistory);

module.exports = router;