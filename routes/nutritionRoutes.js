const express = require('express');
const router = express.Router();
const { getFoodRecommendations } = require('../Controllers/nutritionController');

router.get('/classification', getFoodRecommendations);

module.exports = router;
