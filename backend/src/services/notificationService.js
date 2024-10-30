let notifications = [
  { id: 1, type: 'New Event', message: 'Shelter Maintenance has been added!', date: '09-23-2024' },
  { id: 2, type: 'Reminder', message: 'Reminder: Pet Training Workshop on 10-01-2024!', date: '10-01-2024' }
];
  
  const getAllNotifications = () => {
    return notifications;
  };
  
  const getNotificationById = (id) => {
    const notificationId = parseInt(id, 10);
    return notifications.find((notification) => notification.id === notificationId);
  };
  
  const addNotification = (type, message) => {
    const newNotification = {
      id: notifications.length + 1, 
      type,
      message,
      date: new Date().toISOString().slice(0, 10) 
    };
    notifications.unshift(newNotification); 
    return newNotification;
  };
  
  const deleteNotification = (id) => {
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index !== -1) {
      return notifications.splice(index, 1)[0]; 
    }
    return null; 
  };
  
  module.exports = { getAllNotifications, getNotificationById, addNotification, deleteNotification };