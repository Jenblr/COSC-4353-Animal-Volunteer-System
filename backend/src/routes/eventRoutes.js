// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');
const { validateEventInput } = require('../middleware/eventMiddleware');

// Define event-specific routes
router.get('/', verifyToken, eventController.getAllEvents);
router.get('/form-options', verifyToken, verifyAdmin, eventController.getFormOptions);
router.get('/:id', verifyToken, verifyAdmin, eventController.getEventById);
router.post('/', verifyToken, verifyAdmin, eventController.createEvent);
router.put('/:id', verifyToken, verifyAdmin, eventController.updateEvent);
router.delete('/:id', verifyToken, verifyAdmin, eventController.deleteEvent);

module.exports = router;
