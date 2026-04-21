const express = require('express');
const router = express.Router();
const { getProfile, updateMedicalProfile, checkMedicalProfile } = require('../controllers/profileController');

router.get('/', getProfile);
router.post('/medical', updateMedicalProfile);
router.get('/check', checkMedicalProfile);

module.exports = router;
