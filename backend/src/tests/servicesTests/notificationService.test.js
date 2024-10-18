const notificationService = require('../../services/notificationService');

describe('Notification Service', () => {
  test('should fetch all notifications', () => {
    const notifications = notificationService.getAllNotifications();
    expect(notifications.length).toBeGreaterThan(0); // Expect that there is at least one notification
  });

  test('should fetch notification by ID', () => {
    const notification = notificationService.getNotificationById(1);
    expect(notification).toBeDefined(); // Expect the notification to exist
    expect(notification.id).toBe(1); // Expect the correct ID
  });

  test('should add a new notification', () => {
    const newNotification = notificationService.addNotification('Test Type', 'Test Message');
    expect(newNotification).toBeDefined();
    expect(newNotification.type).toBe('Test Type');
    expect(newNotification.message).toBe('Test Message');
  });

  test('should delete notification by ID', () => {
    const deletedNotification = notificationService.deleteNotification(1);
    expect(deletedNotification).toBeDefined();
    expect(deletedNotification.id).toBe(1);
  });

  test('should return null when deleting a non-existent notification', () => {
    const deletedNotification = notificationService.deleteNotification(999);
    expect(deletedNotification).toBeNull();
  });
});