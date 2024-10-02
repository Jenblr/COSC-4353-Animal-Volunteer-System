/* 'authRoutes.js' file:
- Defines routes for user registration and login
- Uses authController for handling
*/

const express = require('express');
const { register, login } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes for our Front-end
router.post('/register', register);
router.post('/login', login);

// Protected routes = for authenticated users only
router.get('/protected-route', verifyToken, (req, res) => {
	res.status(200).json({ message: 'This is a protected route for logged-in users only!' });
});

// Admin-only route
router.get('/admin-only', verifyToken, verifyAdmin, (req, res) => {
	res.status(200).json({ message: 'This is a protected route for Admin users only!' });
});

module.exports = router;