const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.post('/finalize-registration', profileController.finalizeRegistration);
router.put('/', verifyToken, profileController.updateProfile);
router.get('/', verifyToken, profileController.getProfile);

module.exports = router;