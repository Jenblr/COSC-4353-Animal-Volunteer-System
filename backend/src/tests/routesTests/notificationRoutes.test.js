const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../routes/notificationRoutes');
const notificationService = require('../../services/notificationService');

jest.mock('../../services/notificationService');
jest.mock('../../middleware/authMiddleware', () => ({
	verifyToken: (req, res, next) => next(),
	verifyAdmin: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/notifications', notificationRoutes);

describe('Notification Routes', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		notificationService.NOTIFICATION_TYPES = {
			NEW_EVENT: 'New Event',
			UPDATE: 'Update',
			REMINDER: 'Reminder'
		};
	});

	describe('GET /notifications', () => {
		test('should return all notifications', async () => {
			const mockNotifications = [
				{ id: 1, type: 'Update', message: 'Test Message' }
			];
			notificationService.getAllNotifications.mockReturnValue(mockNotifications);

			const res = await request(app).get('/notifications');

			expect(res.status).toBe(200);
			expect(res.body.notifications).toEqual(mockNotifications);
			expect(res.body.count).toBe(1);
		});

		test('should filter notifications by type', async () => {
			const mockNotifications = [
				{ id: 1, type: 'Update', message: 'Test Message' }
			];
			notificationService.getAllNotifications.mockReturnValue(mockNotifications);

			const res = await request(app)
				.get('/notifications')
				.query({ type: 'Update' });

			expect(res.status).toBe(200);
			expect(res.body.notifications).toEqual(mockNotifications);
		});
	});

	describe('GET /notifications/types', () => {
		test('should return notification types', async () => {
			const res = await request(app).get('/notifications/types');

			expect(res.status).toBe(200);
			expect(res.body.types).toEqual({
				all: ['New Event', 'Update', 'Reminder'],
				manual: ['Update', 'Reminder']
			});
		});
	});

	describe('POST /notifications/add', () => {
		test('should add valid update notification', async () => {
			const mockNotification = {
				id: 1,
				type: 'Update',
				message: 'Test Message'
			};
			notificationService.addUpdateNotification.mockReturnValue(mockNotification);

			const res = await request(app)
				.post('/notifications/add')
				.send({ type: 'Update', message: 'Test Message' });

			expect(res.status).toBe(201);
			expect(res.body).toEqual({
				message: 'Notification added successfully',
				notification: mockNotification
			});
		});

		test('should add valid reminder notification', async () => {
			const mockNotification = {
				id: 2,
				type: 'Reminder',
				message: 'Test Reminder'
			};
			notificationService.addReminderNotification.mockReturnValue(mockNotification);

			const res = await request(app)
				.post('/notifications/add')
				.send({ type: 'Reminder', message: 'Test Reminder' });

			expect(res.status).toBe(201);
			expect(res.body).toEqual({
				message: 'Notification added successfully',
				notification: mockNotification
			});
		});

		test('should reject NEW_EVENT type notifications', async () => {
			const res = await request(app)
				.post('/notifications/add')
				.send({ type: 'New Event', message: 'Test Message' });

			expect(res.status).toBe(400);
			expect(res.body).toEqual({
				error: 'New event notifications are created automatically and cannot be added manually'
			});
		});

		test('should reject invalid notification type', async () => {
			const res = await request(app)
				.post('/notifications/add')
				.send({ type: 'Invalid', message: 'Test Message' });

			expect(res.status).toBe(400);
			expect(res.body.error).toContain('Invalid notification type');
		});

		test('should reject empty message', async () => {
			const res = await request(app)
				.post('/notifications/add')
				.send({ type: 'Update', message: '' });

			expect(res.status).toBe(400);
			expect(res.body.error).toContain('message');
		});
	});

	describe('GET /notifications/:id', () => {
		test('should return specific notification', async () => {
			const mockNotification = {
				id: 1,
				type: 'Update',
				message: 'Test Message'
			};
			notificationService.getNotificationById.mockReturnValue(mockNotification);

			const res = await request(app).get('/notifications/1');

			expect(res.status).toBe(200);
			expect(res.body).toEqual({ notification: mockNotification });
		});

		test('should return 404 for non-existent notification', async () => {
			notificationService.getNotificationById.mockReturnValue(null);

			const res = await request(app).get('/notifications/999');

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ message: 'Notification not found' });
		});

		test('should return 400 for invalid ID', async () => {
			const res = await request(app).get('/notifications/invalid');

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ message: 'Invalid ID' });
		});
	});

	describe('DELETE /notifications/delete/:id', () => {
		test('should delete existing notification', async () => {
			const mockNotification = {
				id: 1,
				type: 'Update',
				message: 'Test Message'
			};
			notificationService.deleteNotification.mockReturnValue(mockNotification);

			const res = await request(app).delete('/notifications/delete/1');

			expect(res.status).toBe(200);
			expect(res.body).toEqual({
				message: 'Notification deleted successfully',
				deletedNotification: mockNotification
			});
		});

		test('should return 404 for non-existent notification', async () => {
			notificationService.deleteNotification.mockReturnValue(null);

			const res = await request(app).delete('/notifications/delete/999');

			expect(res.status).toBe(404);
			expect(res.body).toEqual({ message: 'Notification not found' });
		});

		test('should return 400 for invalid ID', async () => {
			const res = await request(app).delete('/notifications/delete/invalid');

			expect(res.status).toBe(400);
			expect(res.body).toEqual({ error: 'Invalid notification ID' });
		});
	});
});