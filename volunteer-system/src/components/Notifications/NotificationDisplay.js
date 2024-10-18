import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add axios for API requests
import '../../styles/NotificationDisplay.css';

const NotificationDisplay = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [newReminder, setNewReminder] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
          console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle admin adding a new update
  const handleAddUpdate = async () => {
    if (newUpdate.trim()) {
      const updateNotification = {
        type: 'Update',
        message: newUpdate,
      };
  
      try {
        const token = localStorage.getItem('token'); // Retrieve the token
        const response = await axios.post('http://localhost:5000/api/notifications/add', updateNotification, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setNotifications(prev => [response.data.newNotification, ...prev]);
        setNewUpdate('');
      } catch (error) {
        console.error('Failed to add update', error);
      }
    }
  };

  // Handle admin adding a new reminder
  const handleAddReminder = async () => {
    if (newReminder.trim()) {
      const reminderNotification = {
        type: 'Reminder',
        message: newReminder,
      };

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/notifications/add', reminderNotification, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        setNotifications(prev => [response.data.newNotification, ...prev]);
        setNewReminder('');
      } catch (error) {
        console.error('Failed to add reminder', error);
      }
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
