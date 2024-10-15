/*const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const historyController = require('../controllers/historyController');

router.get('/', verifyToken, historyController.getHistory);
router.post('/', verifyToken, historyController.addHistoryRecord);
router.put('/:recordId', verifyToken, historyController.updateHistoryRecord);
router.delete('/:recordId', verifyToken, historyController.deleteHistoryRecord);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const historyService = require('../services/historyService');

router.get('/', verifyToken, async (req, res) => {
  try {
    const history = await historyService.getHistory(req.userId);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const result = await historyService.addHistoryRecord(req.userId, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error adding history record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:recordId', verifyToken, async (req, res) => {
  try {
    const result = await historyService.updateHistoryRecord(req.userId, req.params.recordId, req.body);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error updating history record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:recordId', verifyToken, async (req, res) => {
  try {
    const result = await historyService.deleteHistoryRecord(req.userId, req.params.recordId);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error deleting history record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
