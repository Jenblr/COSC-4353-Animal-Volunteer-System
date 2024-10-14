const notificationService = require('../services/notificationService'); // Import your service file
// Get all notifications

const getNotifications = (req, res) => {
  const notifications = notificationService.getAllNotifications();
  res.status(200).json({ notifications });
};

const getNotification = (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  const notification = notificationService.getNotificationById(id);
  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.status(200).json({ notification });
};

// Add a new notification
const addNotification = (req, res) => {
  const { type, message } = req.body;
  if (!type || !message) {
    return res.status(400).json({ error: "Type and message are required fields" });
  }
  const newNotification = notificationService.addNotification(type, message);
  res.status(201).json({ message: "Notification added successfully", newNotification });
};

// Delete a notification by ID
const deleteNotification = (req, res) => {
  const { id } = req.params;
  const notificationId = parseInt(id, 10);
  if (isNaN(notificationId)) {
    return res.status(400).json({ error: "Invalid notification ID" });
  }
  const deletedNotification = notificationService.deleteNotification(notificationId);
  if (!deletedNotification) {
    return res.status(404).json({ message: 'Notification not found' });
  }
  res.status(200).json({ message: 'Notification deleted successfully', deletedNotification });
};

module.exports = { getNotifications, addNotification, deleteNotification, getNotification };