import React, { useState } from 'react';
import Notification from './Notification';
import './App.css';

const events = [
  { id: 1, name: 'Event ex1', time: new Date(Date.now() + 10000) },
  { id: 2, name: 'Event ex2', time: new Date(Date.now() + 20000) } 
];

function App() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    setNotifications([...notifications, message]);
  };
 
  const removeNotification = (index) => {
    setNotifications(notifications.filter((_, i) => i !== index));
  };

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
