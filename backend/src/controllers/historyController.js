// historyController.js

const historyService = require('../services/historyService');

exports.getHistory = (req, res) => {
  const userId = req.userId;
  console.log('Controller: Fetching history for userId:', userId);
  const history = historyService.getHistory(userId);
  res.status(200).json(history);
};

exports.addHistoryRecord = (req, res) => {
  const userId = req.userId;
  const recordData = req.body;
  const result = historyService.addHistoryRecord(userId, recordData);
  res.status(result.status).json(result);
};

exports.updateHistoryRecord = (req, res) => {
  const userId = req.userId;
  const { id, ...updateData } = req.body;
  const result = historyService.updateHistoryRecord(userId, id, updateData);
  res.status(result.status).json(result);
};

exports.deleteHistoryRecord = (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const result = historyService.deleteHistoryRecord(userId, id);
  res.status(result.status).json(result);
};
