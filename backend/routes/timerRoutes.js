const express = require('express');
const router = express.Router();
const { getActiveTimer, startTimer, stopTimer } = require('../controllers/timerController');

router.get('/', getActiveTimer);
router.post('/', startTimer);
router.post('/stop', stopTimer);

module.exports = router;
