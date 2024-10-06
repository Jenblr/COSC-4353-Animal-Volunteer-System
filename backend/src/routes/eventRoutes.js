const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { validateEventInput } = require('../middleware/validateEventInput');

//routesprotected and accessible only to admins
router.use(verifyToken, verifyAdmin);

//validateEventInput middleware to POST and PUT routes
router.post('/', validateEventInput, eventController.createEvent);
router.put('/:id', validateEventInput, eventController.updateEvent);

//other routes
router.get('/', eventController.getAllEvents);
router.get('/form-options', eventController.getFormOptions);
router.get('/:id', eventController.getEventById);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;