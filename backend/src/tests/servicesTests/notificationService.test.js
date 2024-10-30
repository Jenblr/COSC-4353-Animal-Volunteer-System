const notificationService = require('../../services/notificationService');

describe('Notification Service', () => {
	beforeEach(() => {
		const notifications = notificationService.getAllNotifications();
		while (notifications.length > 0) {
			notifications.pop();
		}
	});

	describe('getAllNotifications', () => {
		test('should fetch all notifications', () => {
			const notifications = notificationService.getAllNotifications();
			expect(Array.isArray(notifications)).toBe(true);
		});
	});

	describe('getNotificationById', () => {
		test('should fetch notification by ID', () => {
			const newNotification = notificationService.addUpdateNotification('Test Message');
			const notification = notificationService.getNotificationById(newNotification.id);
			expect(notification).toBeDefined();
			expect(notification.id).toBe(newNotification.id);
		});

		test('should return undefined for non-existent ID', () => {
			const notification = notificationService.getNotificationById(999);
			expect(notification).toBeUndefined();
		});
	});

	describe('createEventNotification', () => {
		test('should create notification for new event', () => {
			const event = {
				eventName: 'Test Event',
				eventDate: '2024-12-25'
			};

			const notification = notificationService.createEventNotification(event);
			expect(notification).toBeDefined();
			expect(notification.type).toBe(notificationService.NOTIFICATION_TYPES.NEW_EVENT);
			expect(notification.message).toContain(event.eventName);
			expect(notification.message).toContain(event.eventDate);
		});
	});

	describe('addUpdateNotification', () => {
		test('should add update notification', () => {
			const message = 'Test Update Message';
			const notification = notificationService.addUpdateNotification(message);

			expect(notification).toBeDefined();
			expect(notification.type).toBe(notificationService.NOTIFICATION_TYPES.UPDATE);
			expect(notification.message).toBe(message);
			expect(notification.date).toBeDefined();
			expect(notification.createdAt).toBeDefined();
		});
	});

	describe('addReminderNotification', () => {
		test('should add reminder notification', () => {
			const message = 'Test Reminder Message';
			const notification = notificationService.addReminderNotification(message);

			expect(notification).toBeDefined();
			expect(notification.type).toBe(notificationService.NOTIFICATION_TYPES.REMINDER);
			expect(notification.message).toBe(message);
			expect(notification.date).toBeDefined();
			expect(notification.createdAt).toBeDefined();
		});
	});

	describe('deleteNotification', () => {
		test('should delete notification by ID', () => {
			const notification = notificationService.addUpdateNotification('Test Message');
			const deleted = notificationService.deleteNotification(notification.id);

			expect(deleted).toBeDefined();
			expect(deleted.id).toBe(notification.id);
			expect(notificationService.getNotificationById(notification.id)).toBeUndefined();
		});

		test('should return null when deleting non-existent notification', () => {
			const deleted = notificationService.deleteNotification(999);
			expect(deleted).toBeNull();
		});
	});

	describe('NOTIFICATION_TYPES', () => {
		test('should have all required notification types', () => {
			expect(notificationService.NOTIFICATION_TYPES).toEqual({
				NEW_EVENT: 'New Event',
				UPDATE: 'Update',
				REMINDER: 'Reminder'
			});
		});
	});
});