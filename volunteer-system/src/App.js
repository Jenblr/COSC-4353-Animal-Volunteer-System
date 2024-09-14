import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Main/Home';
import Taskbar from './components/Main/Taskbar';
import Calendar from './components/Events/Calendar';
import Profile from './components/Profile/Profile';
import LoginPage from './components/Authentication/LoginPage';
import AdminLoginPage from './components/Authentication/AdminLoginPage';
import NotificationDisplay from './components/Notifications/NotificationDisplay';
import './App.css'

function App() {
  return (
    <Router>
      <div>
        <Taskbar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/notifications" element={<NotificationDisplay />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App;