const express = require('express');
const router = express.Router();
const cardController = require('./controllers');

router.get('/', cardController.getBusinessCard);

module.exports = router;
