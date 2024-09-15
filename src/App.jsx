import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import './App.css';

//test events
const events = [
  { id: 1, name: 'Event ex1', time: new Date(Date.now() + 10000) }, // 10 seconds from now
  { id: 2, name: 'Event ex2', time: new Date(Date.now() + 20000) }  // 20 seconds from now
];

function App() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications([...notifications, message]);
  };

  const removeNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const checkEvents = () => {
      const now = new Date();
      events.forEach((event) => {
        if (event.time <= now && !notifications.some((msg) => msg.includes(event.name))) {
          addNotification(`Reminder: ${event.name}`);
        }
      });
    };

    // Check events every second
    const intervalId = setInterval(checkEvents, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [notifications]);

  return (
    <div className="App">
      <button onClick={() => addNotification('Notif Example')}>Add Notification</button>
      <div className="notifications-container">
        {notifications.map((message, index) => (
          <Notification
            key={index}
            message={message}
            onClose={() => removeNotification(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
