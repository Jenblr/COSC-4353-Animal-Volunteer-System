const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../utils/validators');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authService = require('../services/authService');

// Public routes 
router.get('/home', (req, res) => {
    res.json('Home data');
});

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

router.get('/profile', profileController.getFormOptions);
router.get('/volunteers', async (req, res) => {
    const volunteers = await authService.getAllVolunteers();
    res.json(volunteers);
});
router.get('/registered-volunteers', authMiddleware.verifyToken, authController.getRegisteredVolunteers);

module.exports = router;