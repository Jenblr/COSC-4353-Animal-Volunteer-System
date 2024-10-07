/* 'authRoutes.js' file:
- Defines routes for user registration and login
- Uses authController for handling
*/

const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../utils/validators');
const authController = require('../controllers/authController');

// Public routes 
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes for regular users
router.get('/home', verifyToken, (req, res) => {
    res.json('Home data');
});

router.get('/calendar', verifyToken, (req, res) => {
    res.json('Calendar data');
});

router.get('/profile', verifyToken, (req, res) => {
    res.json('Profile data');
});

router.get('/manage-profile', verifyToken, (req, res) => {
    res.json('Manage Profile data');
});

router.get('/volunteer-history', verifyToken, (req, res) => {
    res.json('Volunteer History data');
});

router.get('/notifications', verifyToken, (req, res) => {
    res.json('Notifications data');
});

// Protected admin-only routes
router.get('/events', verifyToken, verifyAdmin, (req, res) => {
    res.json('Events data');
});

router.get('/event-management', verifyToken, verifyAdmin, (req, res) => {
    res.json('Event Management data');
});

router.get('/volunteer-event-match', verifyToken, verifyAdmin, (req, res) => {
    res.json('Volunteer Event Match data');
});

module.exports = router;