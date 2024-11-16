const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/volunteers', verifyToken, verifyAdmin, reportsController.getVolunteerReport);
router.get('/volunteers/:id', verifyToken, verifyAdmin, reportsController.getSpecificVolunteerReport);

module.exports = router;