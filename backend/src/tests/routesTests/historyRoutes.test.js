const request = require('supertest');
const express = require('express');
const historyRoutes = require('../../routes/historyRoutes');
const { verifyToken } = require('../../middleware/authMiddleware');
const historyService = require('../../services/historyService');

jest.mock('../../middleware/authMiddleware');
jest.mock('../../services/historyService');

const app = express();
app.use(express.json());
app.use('/api/history', historyRoutes);

describe('History Routes', () => {
  beforeEach(() => {
    verifyToken.mockImplementation((req, res, next) => {
      req.userId = 'testUserId';
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/history', () => {
    test('should return history', async () => {
      const mockHistory = [{ id: 1, eventName: 'Pet Training Workshop' }];
      historyService.getHistory.mockResolvedValue(mockHistory);

      const response = await request(app).get('/api/history');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockHistory);
      expect(historyService.getHistory).toHaveBeenCalledWith('testUserId');
    });
  });

  describe('POST /api/history', () => {
    test('should add a new history record', async () => {
      const newRecord = { eventName: 'Pet Adoption Day', date: '2023-07-15' };
      historyService.addHistoryRecord.mockResolvedValue({ status: 201, record: { id: 2, ...newRecord } });

      const response = await request(app)
        .post('/api/history')
        .send(newRecord);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ status: 201, record: { id: 2, ...newRecord } });
      expect(historyService.addHistoryRecord).toHaveBeenCalledWith('testUserId', newRecord);
    });
  });

  describe('PUT /api/history/:recordId', () => {
    test('should update a history record', async () => {
      const updatedRecord = { id: 1, eventName: 'Updated Pet Training Workshop' };
      historyService.updateHistoryRecord.mockResolvedValue({ status: 200, record: updatedRecord });

      const response = await request(app)
        .put('/api/history/1')
        .send(updatedRecord);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ status: 200, record: updatedRecord });
      expect(historyService.updateHistoryRecord).toHaveBeenCalledWith('testUserId', '1', updatedRecord);
    });
  });

  describe('DELETE /api/history/:recordId', () => {
    test('should delete a history record', async () => {
      historyService.deleteHistoryRecord.mockResolvedValue({ status: 200, message: 'Record deleted successfully' });

      const response = await request(app).delete('/api/history/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ status: 200, message: 'Record deleted successfully' });
      expect(historyService.deleteHistoryRecord).toHaveBeenCalledWith('testUserId', '1');
    });
  });
});