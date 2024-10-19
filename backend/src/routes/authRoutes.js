const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../utils/validators');
const profileController = require('../controllers/profileController');
const authController = require('../controllers/authController');

// Public routes 
router.get('/home', (req, res) => {
    res.json('Home data');
});

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

router.get('/profile', profileController.getFormOptions);
router.get('/volunteers', authController.getAllVolunteers);

module.exports = router;