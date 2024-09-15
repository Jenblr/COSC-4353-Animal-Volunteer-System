import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './NotificationDisplay.css';

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <button onClick={onClose} className="close-button" aria-label="Close">✖</button>
      {message}
    </div>
  );
};

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://f05e1c5b-9ff3-483d-8700-c9f7559c0ca3-00-3tkbw2on6xx87.picard.replit.dev/'); //connecting to websocket
    setSocket(newSocket);

    newSocket.on('notification', (data) => {
      setNotifications(prev => [...prev, data]);
    });

    return () => newSocket.close();
  }, []);

  const handleClose = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  //testing notif display
  return (
    <div className="NotificationDisplay">
      <h1>NotificationDisplay Test</h1>
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            message={notification.message}
            type={notification.type}
            onClose={() => handleClose(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Notification;