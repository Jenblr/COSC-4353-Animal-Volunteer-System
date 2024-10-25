const notificationService = require('../services/notificationService');

const getNotifications = (req, res) => {
	try {
		const { type } = req.query;
		let notifications = notificationService.getAllNotifications();

		if (type && Object.values(notificationService.NOTIFICATION_TYPES).includes(type)) {
			notifications = notifications.filter(notification => notification.type === type);
		}

		res.status(200).json({
			count: notifications.length,
			notifications
		});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching notifications', error: error.message });
	}
};

const getNotification = (req, res) => {
	try {
		const id = parseInt(req.params.id, 10);

		if (isNaN(id)) {
			return res.status(400).json({ message: 'Invalid ID' });
		}

		const notification = notificationService.getNotificationById(id);
		if (!notification) {
			return res.status(404).json({ message: 'Notification not found' });
		}

		res.status(200).json({ notification });
	} catch (error) {
		res.status(500).json({ message: 'Error fetching notification', error: error.message });
	}
};

const addNotification = (req, res) => {
	try {
		const { type, message } = req.body;

		if (type === notificationService.NOTIFICATION_TYPES.NEW_EVENT) {
			return res.status(400).json({
				error: "New event notifications are created automatically and cannot be added manually"
			});
		}

		if (!Object.values(notificationService.NOTIFICATION_TYPES).includes(type)) {
			return res.status(400).json({
				error: "Invalid notification type. Must be either 'Update' or 'Reminder'",
				allowedTypes: [
					notificationService.NOTIFICATION_TYPES.UPDATE,
					notificationService.NOTIFICATION_TYPES.REMINDER
				]
			});
		}

		if (!message || typeof message !== 'string' || message.trim().length === 0) {
			return res.status(400).json({
				error: "Message is required and must be a non-empty string"
			});
		}

		let newNotification;
		if (type === notificationService.NOTIFICATION_TYPES.UPDATE) {
			newNotification = notificationService.addUpdateNotification(message);
		} else if (type === notificationService.NOTIFICATION_TYPES.REMINDER) {
			newNotification = notificationService.addReminderNotification(message);
		}

		res.status(201).json({
			message: "Notification added successfully",
			notification: newNotification
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error creating notification',
			error: error.message
		});
	}
};

const deleteNotification = (req, res) => {
	try {
		const { id } = req.params;
		const notificationId = parseInt(id, 10);

		if (isNaN(notificationId)) {
			return res.status(400).json({ error: "Invalid notification ID" });
		}

		const deletedNotification = notificationService.deleteNotification(notificationId);

		if (!deletedNotification) {
			return res.status(404).json({ message: 'Notification not found' });
		}

		res.status(200).json({
			message: 'Notification deleted successfully',
			deletedNotification
		});
	} catch (error) {
		res.status(500).json({
			message: 'Error deleting notification',
			error: error.message
		});
	}
};

const getNotificationTypes = (req, res) => {
	try {
		const types = {
			all: Object.values(notificationService.NOTIFICATION_TYPES),
			manual: [
				notificationService.NOTIFICATION_TYPES.UPDATE,
				notificationService.NOTIFICATION_TYPES.REMINDER
			]
		};

		res.status(200).json({ types });
	} catch (error) {
		res.status(500).json({
			message: 'Error fetching notification types',
			error: error.message
		});
	}
};

module.exports = {
	getNotifications,
	getNotification,
	addNotification,
	deleteNotification,
	getNotificationTypes
};