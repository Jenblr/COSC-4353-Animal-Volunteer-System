const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const historyController = require('../controllers/historyController');

router.get('/', verifyToken, historyController.getHistory);
router.post('/', verifyToken, historyController.addHistoryRecord);
router.put('/', verifyToken, historyController.updateHistoryRecord);
router.delete('/:recordId', verifyToken, historyController.deleteHistoryRecord);

module.exports = router;
