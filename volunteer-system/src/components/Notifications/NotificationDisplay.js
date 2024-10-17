import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import axios from 'axios'; // Add axios for API requests
=======
>>>>>>> origin/JenniferN
import '../../styles/NotificationDisplay.css';

const NotificationDisplay = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [newReminder, setNewReminder] = useState('');

<<<<<<< HEAD
  useEffect(() => { 
    // Fetch notifications from the backend
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}` // Attach the token to the Authorization header
          }
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
=======
  useEffect(() => {
    const fetchNotifications = () => {
      const sampleNotifications = [
        { type: 'New Event', message: 'Shelter Maintenance has been added!', date: '09-23-2024' },
        { type: 'Reminder', message: 'Reminder: Pet Training Workshop on 10-01-2024!', date: '10-01-2024' }
      ];
      setNotifications(sampleNotifications);
>>>>>>> origin/JenniferN
    };

    fetchNotifications();
  }, []);

  // Handle admin adding a new update
<<<<<<< HEAD
  const handleAddUpdate = async () => {
=======
  const handleAddUpdate = () => {
>>>>>>> origin/JenniferN
    if (newUpdate.trim()) {
      const updateNotification = {
        type: 'Update',
        message: newUpdate,
<<<<<<< HEAD
      };

      try {
        const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
        const response = await axios.post('http://localhost:5000/api/notifications/add', updateNotification, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        });
        setNotifications(prev => [response.data.newNotification, ...prev]);
        setNewUpdate('');
      } catch (error) {
        console.error('Failed to add update', error);
      }
=======
        date: new Date().toISOString().slice(0, 10)
      };
      setNotifications(prev => [updateNotification, ...prev]);
      setNewUpdate('');
>>>>>>> origin/JenniferN
    }
  };

  // Handle admin adding a new reminder
<<<<<<< HEAD
  const handleAddReminder = async () => {
=======
  const handleAddReminder = () => {
>>>>>>> origin/JenniferN
    if (newReminder.trim()) {
      const reminderNotification = {
        type: 'Reminder',
        message: newReminder,
<<<<<<< HEAD
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
=======
        date: new Date().toISOString().slice(0, 10)
      };
      setNotifications(prev => [reminderNotification, ...prev]);
      setNewReminder('');
>>>>>>> origin/JenniferN
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

<<<<<<< HEAD
export default NotificationDisplay;
=======
export default NotificationDisplay;
>>>>>>> origin/JenniferN
