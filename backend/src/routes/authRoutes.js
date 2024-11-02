const express = require('express');
const router = express.Router();
const { validateRegistration, validateLogin } = require('../utils/validators');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes w/ validation
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/volunteers',
	authMiddleware.verifyToken,
	authMiddleware.verifyAdmin,
	authController.getAllVolunteers
);

router.get('/registered-volunteers',
	authMiddleware.verifyToken,
	authMiddleware.verifyAdmin,
	authController.getRegisteredVolunteers
);

router.get('/verify', authMiddleware.verifyToken, (req, res) => {
    res.json({
        id: req.userId,
        email: req.userEmail,
        role: req.userRole
    });
});

module.exports = router;