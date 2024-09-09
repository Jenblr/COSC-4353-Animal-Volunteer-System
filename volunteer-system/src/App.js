import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Taskbar from './components/Main/Taskbar';
import Calendar from './components/Events/Calendar';
import Profile from './components/Profile/Profile';
import NotificationDisplay from './components/Notifications/NotificationDisplay';
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Taskbar />
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationDisplay />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;