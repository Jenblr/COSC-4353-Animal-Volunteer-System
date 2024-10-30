const notifications = [];

const NOTIFICATION_TYPES = {
	NEW_EVENT: 'New Event',
	UPDATE: 'Update',
	REMINDER: 'Reminder'
};

const getAllNotifications = () => {
	return notifications;
};

const getNotificationById = (id) => {
	const notificationId = parseInt(id, 10);
	return notifications.find((notification) => notification.id === notificationId);
};

const createEventNotification = (event) => {
	const message = `New volunteer opportunity: ${event.eventName} on ${event.eventDate}!`;
	return addNotification(NOTIFICATION_TYPES.NEW_EVENT, message);
};

const addNotification = (type, message) => {
	const newNotification = {
		id: notifications.length + 1,
		type,
		message,
		date: new Date().toISOString().slice(0, 10),
		createdAt: new Date().toISOString()
	};
	notifications.unshift(newNotification);
	return newNotification;
};

const addUpdateNotification = (message) => {
	return addNotification(NOTIFICATION_TYPES.UPDATE, message);
};

const addReminderNotification = (message) => {
	return addNotification(NOTIFICATION_TYPES.REMINDER, message);
};

const deleteNotification = (id) => {
	const index = notifications.findIndex((notification) => notification.id === id);
	if (index !== -1) {
		return notifications.splice(index, 1)[0];
	}
	return null;
};

module.exports = {
	getAllNotifications,
	getNotificationById,
	createEventNotification,
	addUpdateNotification,
	addReminderNotification,
	deleteNotification,
	NOTIFICATION_TYPES
};