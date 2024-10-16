const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/', verifyToken, profileController.getProfile);
router.post('/', verifyToken, profileController.createProfile);
router.put('/', verifyToken, profileController.updateProfile);

module.exports = router;

