const express = require('express');
const router = express.Router();
const { getPrice } = require('../controllers/priceCalculationController');

router.post('/calculate', getPrice);

module.exports = router;
