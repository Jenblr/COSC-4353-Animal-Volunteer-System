const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../routes/notificationRoutes');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService'); // Mock the service
jest.mock('../../middleware/authMiddleware', () => ({
  verifyToken: (req, res, next) => next(),  // Skip token verification
  verifyAdmin: (req, res, next) => next()   // Skip admin verification
}));

const app = express();

app.use(express.json());
app.use('/notifications', notificationRoutes);

describe('Notification Routes', () => {
  beforeEach(() => {
    notificationService.getAllNotifications.mockReturnValue([{ id: 1, type: 'Test', message: 'Test Message' }]);
  });

  test('GET /notifications should return 200', async () => {
    const res = await request(app).get('/notifications');
    expect(res.statusCode).toEqual(200);
    expect(res.body.notifications.length).toBe(1);
    expect(res.body.notifications[0].type).toBe('Test');
  });

  test('POST /notifications/add should return 201 when notification is valid', async () => {
    notificationService.addNotification.mockReturnValue({
      id: 3,
      type: 'Test',
      message: 'Test Message',
    });

    const res = await request(app)
      .post('/notifications/add')
      .send({ type: 'Test', message: 'Test Message' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Notification added successfully');
  });

});