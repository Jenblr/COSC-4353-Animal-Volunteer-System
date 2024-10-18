const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { validateNotification } = require('../middleware/notificationMiddleware');
const notificationController = require('../controllers/notificationController');

// Define routes
router.get('/', verifyToken, notificationController.getNotifications); // Get all notifications
router.get('/:id', verifyToken, notificationController.getNotification); // Get a single notification by ID (optional)
router.post('/add', verifyToken, verifyAdmin, validateNotification, notificationController.addNotification); // Admin only: Add a new notification
router.delete('/delete/:id', verifyToken, verifyAdmin, notificationController.deleteNotification); // Admin only: Delete a notification by ID

module.exports = router;