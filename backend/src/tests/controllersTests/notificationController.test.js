const notificationController = require('../../controllers/notificationController');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');

describe('Notification Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should get all notifications', () => {
    notificationService.getAllNotifications.mockReturnValue([{ id: 1, type: 'Test', message: 'Message' }]);
    notificationController.getNotifications(req, res);
    expect(notificationService.getAllNotifications).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notifications: [{ id: 1, type: 'Test', message: 'Message' }] });
  });

  test('should return a notification when a valid ID is provided', () => {
    req.params.id = '1';
    
    const mockNotification = { id: 1, type: 'Test', message: 'Test Message' };
    notificationService.getNotificationById.mockReturnValue(mockNotification);
  
    notificationController.getNotification(req, res);
  
    expect(notificationService.getNotificationById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ notification: mockNotification });
  });

  test('should add a notification', () => {
    req.body = { type: 'Test', message: 'Test Message' };
    const newNotification = { id: 1, type: 'Test', message: 'Test Message' };
    notificationService.addNotification.mockReturnValue(newNotification);
    
    notificationController.addNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Notification added successfully", newNotification
    });
  });
  
  test('should return 400 when type is missing', () => {
    req.body = { message: 'Test Message' };  // Missing type
  
    notificationController.addNotification(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Type and message are required fields' });
  });
  
  test('should return 400 when message is missing', () => {
    req.body = { type: 'Test' };  // Missing message
  
    notificationController.addNotification(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Type and message are required fields' });
  });

  test('should return 404 when notification not found', () => {
    req.params.id = 999;
    notificationService.getNotificationById.mockReturnValue(null);

    notificationController.getNotification(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });

  test('should return 400 when ID is invalid', () => {
    req.params.id = 'invalid';  // Invalid ID
  
    notificationController.getNotification(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ID' });
  });

  test('should delete a notification by ID', () => {
    req.params.id = '1';  // Simulate valid ID as a string
    const mockNotification = { id: 1, type: 'Test', message: 'Test Message' };
  
    // Mock the service function to return a notification
    notificationService.deleteNotification.mockReturnValue(mockNotification);
  
    // Call the controller function
    notificationController.deleteNotification(req, res);
  
    // Expect the service method to be called with the correct ID
    expect(notificationService.deleteNotification).toHaveBeenCalledWith(1);
    
    // Check that the response has the correct status and json data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Notification deleted successfully',
      deletedNotification: mockNotification
    });
  });
  
  test('should return 404 when deleting a non-existent notification', () => {
    req.params.id = '999';  // Simulate non-existent ID
    notificationService.deleteNotification.mockReturnValue(null);
  
    notificationController.deleteNotification(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
  });
  
  test('should return 400 when deleting with an invalid ID', () => {
    req.params.id = 'invalid';  // Simulate invalid ID
  
    notificationController.deleteNotification(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid notification ID' });
  });
});

