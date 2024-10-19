const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const matchingController = require('../controllers/matchingController');

router.get('/:eventId', verifyToken, verifyAdmin, matchingController.getMatchingVolunteers);
router.post('/', verifyToken, verifyAdmin, matchingController.matchVolunteerToEvent);

module.exports = router;