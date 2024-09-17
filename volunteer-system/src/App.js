import React, { useState, useEffect } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is logged in by looking for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('role'); 

    if (token) {
      setIsLoggedIn(true);
      if (userRole === 'admin') {
        setIsAdmin(true);  
      }
    }
    
  }, []); 

  return (
    <Router>
      <div>
      <Taskbar isAdmin={isAdmin} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/manage-profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/admin-login" element={<AdminLoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/notifications" element={<NotificationDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;