const notificationController = require('../../controllers/notificationController');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');

describe('Notification Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' } };  // Mocked ID should be a string
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should get all notifications', () => {
    notificationService.getAllNotifications.mockReturnValue([{ id: 1, type: 'Test', message: 'Message' }]);
    notificationController.getNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notifications: [{ id: 1, type: 'Test', message: 'Message' }] });
  });

  test('should return a notification when a valid ID is provided', () => {
    // Mock the service to return a notification when the ID is 1
    const mockNotification = { id: 1, type: 'Test', message: 'Test Message' };
    notificationService.getNotificationById.mockReturnValue(mockNotification);

    notificationController.getNotification(req, res);

    expect(notificationService.getNotificationById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notification: mockNotification });
  });

  test('should add a notification', () => {
    req.body = { type: 'Test', message: 'Test Message' };
    const newNotification = { id: 3, type: 'Test', message: 'Test Message' };
    notificationService.addNotification.mockReturnValue(newNotification);
    
    notificationController.addNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Notification added successfully", newNotification
    });
  });

  test('should return 404 when notification not found', () => {
    req.params.id = 999;
    notificationService.getNotificationById.mockReturnValue(null);

    notificationController.getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });

  // Add more tests for other methods like deleteNotification, etc.
});