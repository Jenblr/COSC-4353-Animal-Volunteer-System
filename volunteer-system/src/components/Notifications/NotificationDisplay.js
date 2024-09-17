import React, { useState, useEffect } from 'react';
import '../../styles/NotificationDisplay.css';

const NotificationDisplay = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [newReminder, setNewReminder] = useState('');

  // Fetch notifications 
  useEffect(() => {
    const fetchNotifications = () => {
      const sampleNotifications = [
        { type: 'New Event', message: 'Shelter Maintenance has been added!', date: '09-23-2024' },
        { type: 'Reminder', message: 'Reminder: Pet Training Workshop on 10-01-2024!', date: '10-01-2024' }
      ];
      setNotifications(sampleNotifications);
    };

    fetchNotifications();
  }, []);

  // Handle admin adding a new update
  const handleAddUpdate = () => {
    if (newUpdate.trim()) {
      const updateNotification = {
        type: 'Update',
        message: newUpdate,
        date: new Date().toISOString().slice(0, 10)
      };
      setNotifications(prev => [updateNotification, ...prev]);
      setNewUpdate('');
    }
  };

  // Handle admin adding a new reminder
  const handleAddReminder = () => {
    if (newReminder.trim()) {
      const reminderNotification = {
        type: 'Reminder',
        message: newReminder,
        date: new Date().toISOString().slice(0, 10)
      };
      setNotifications(prev => [reminderNotification, ...prev]);
      setNewReminder('');
    }
  };

  return (
    <div className="notification-display-container">
      <h2>Notifications</h2>
      <ul className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <li key={index} className={`notification-item ${notification.type.toLowerCase()}`}>
              <strong>{notification.type}:</strong> {notification.message} <em>({notification.date})</em>
            </li>
          ))
        ) : (
          <li>No notifications available</li>
        )}
      </ul>

      {isAdmin && (
        <div className="admin-notification-actions">
          <h3>Admin Actions</h3>
          <div className="add-notification">
            <input
              type="text"
              placeholder="Add Update Message"
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
            />
            <button onClick={handleAddUpdate}>Add Update</button>
          </div>
          <div className="add-notification">
            <input
              type="text"
              placeholder="Add Reminder Message"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
            />
            <button onClick={handleAddReminder}>Add Reminder</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDisplay;
