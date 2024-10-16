// Sample in-memory data (replace with database operations as needed)
let notifications = [
  { id: 1, type: 'New Event', message: 'Shelter Maintenance has been added!', date: '09-23-2024' },
  { id: 2, type: 'Reminder', message: 'Reminder: Pet Training Workshop on 10-01-2024!', date: '10-01-2024' }
];
  
  // Get all notifications
  const getAllNotifications = () => {
    return notifications;
  };
  
  // Get a single notification by ID
  const getNotificationById = (id) => {
    const notificationId = parseInt(id, 10);
    return notifications.find((notification) => notification.id === notificationId);
  };
  
  // Add a new notification
  const addNotification = (type, message) => {
    const newNotification = {
      id: notifications.length + 1, // Simple incremental ID for demonstration
      type,
      message,
      date: new Date().toISOString().slice(0, 10) // Current date
    };
    notifications.unshift(newNotification); // Add new notification to the beginning of the list
    return newNotification;
  };
  
  // Delete a notification by ID
  const deleteNotification = (id) => {
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index !== -1) {
      return notifications.splice(index, 1)[0]; // Remove and return the deleted notification
    }
    return null; // Return null if notification not found
  };
  
  module.exports = { getAllNotifications, getNotificationById, addNotification, deleteNotification };