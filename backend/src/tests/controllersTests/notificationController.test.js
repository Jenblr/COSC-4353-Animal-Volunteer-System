const notificationController = require('../../controllers/notificationController');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');

describe('Notification Controller', () => {
	let req, res;

	beforeEach(() => {
		req = {
			params: {},
			body: {},
			query: {}
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		jest.clearAllMocks();
	});

	describe('getNotifications', () => {
		test('should get all notifications', () => {
			const mockNotifications = [
				{ id: 1, type: 'Update', message: 'Message' }
			];
			notificationService.getAllNotifications.mockReturnValue(mockNotifications);

			notificationController.getNotifications(req, res);

			expect(notificationService.getAllNotifications).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				count: 1,
				notifications: mockNotifications
			});
		});

		test('should filter notifications by type', () => {
			req.query.type = 'Update';
			const mockNotifications = [
				{ id: 1, type: 'Update', message: 'Message' }
			];
			notificationService.getAllNotifications.mockReturnValue(mockNotifications);
			notificationService.NOTIFICATION_TYPES = {
				UPDATE: 'Update'
			};

			notificationController.getNotifications(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				count: 1,
				notifications: mockNotifications
			});
		});
	});

	describe('getNotification', () => {
		test('should return a notification when valid ID is provided', () => {
			req.params.id = '1';
			const mockNotification = { id: 1, type: 'Update', message: 'Test Message' };
			notificationService.getNotificationById.mockReturnValue(mockNotification);

			notificationController.getNotification(req, res);

			expect(notificationService.getNotificationById).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ notification: mockNotification });
		});

		test('should return 404 when notification not found', () => {
			req.params.id = '999';
			notificationService.getNotificationById.mockReturnValue(null);

			notificationController.getNotification(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
		});
	});

	describe('addNotification', () => {
		test('should reject NEW_EVENT type notifications', () => {
			req.body = {
				type: notificationService.NOTIFICATION_TYPES.NEW_EVENT,
				message: 'Test Message'
			};

			notificationController.addNotification(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({
				error: "New event notifications are created automatically and cannot be added manually"
			});
		});

		test('should add valid update notification', () => {
			req.body = {
				type: 'Update',
				message: 'Test Message'
			};
			const newNotification = { id: 1, ...req.body };
			notificationService.addUpdateNotification.mockReturnValue(newNotification);
			notificationService.NOTIFICATION_TYPES = {
				UPDATE: 'Update'
			};

			notificationController.addNotification(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				message: "Notification added successfully",
				notification: newNotification
			});
		});

		test('should add valid reminder notification', () => {
			req.body = {
				type: 'Reminder',
				message: 'Test Message'
			};
			const newNotification = { id: 1, ...req.body };
			notificationService.addReminderNotification.mockReturnValue(newNotification);
			notificationService.NOTIFICATION_TYPES = {
				REMINDER: 'Reminder'
			};

			notificationController.addNotification(req, res);

			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({
				message: "Notification added successfully",
				notification: newNotification
			});
		});
	});

	describe('getNotificationTypes', () => {
		test('should return all notification types', () => {
			notificationService.NOTIFICATION_TYPES = {
				NEW_EVENT: 'New Event',
				UPDATE: 'Update',
				REMINDER: 'Reminder'
			};

			notificationController.getNotificationTypes(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				types: {
					all: ['New Event', 'Update', 'Reminder'],
					manual: ['Update', 'Reminder']
				}
			});
		});
	});
});