const { validateNotification } = require('../../middleware/notificationMiddleware');

describe('Notification Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('should return error if type is missing', () => {
    req.body = { message: 'Test Message' };
    validateNotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid notification: 'type' is a required field and must be a string." });
  });

  test('should return error if message is missing', () => {
    req.body = { type: 'Test' };
    validateNotification(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid notification: 'message' is a required field and must be a string." });
  });

  test('should pass the request if type and message are valid', () => {
    req.body = { type: 'Test', message: 'Test Message' };
    validateNotification(req, res, next);
    expect(next).toHaveBeenCalled(); // Middleware should call next() for valid data
  });
});