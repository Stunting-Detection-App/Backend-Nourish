const express = require('express');
const router = express.Router();
const predictionController = require('../Controllers/predictionController');
const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, predictionController.predict);
router.get('/history', authenticate, predictionController.getHistory);

module.exports = router;