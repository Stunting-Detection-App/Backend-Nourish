const express = require('express');
const router = express.Router();
const { predict, getHistory } = require('../Controllers/predictionController');
const authenticate = require('../middleware/authenticate');

router.post('/predict', authenticate, predict);
router.get('/predict', authenticate, getHistory);

module.exports = router;