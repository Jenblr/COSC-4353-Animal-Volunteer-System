import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Main/Home';
import Taskbar from './components/Main/Taskbar';
import Calendar from './components/Events/Calendar';
// import EventManagementForm from './components/Events/EventManagementForm';
import VolunteerMatchForm from './components/Events/VolunteerMatchingForm';
import Profile from './components/Profile/Dashboard';
import ProfileForm from './components/Profile/ProfileForm';
import Registration from './components/Authentication/RegistrationPage';
import LoginPage from './components/Authentication/LoginPage';
import AdminLoginPage from './components/Authentication/AdminLoginPage';
import VolunteerHistory from './components/Profile/VolunteerHistory';
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

          <Route path="/calendar" element={<Calendar isAdmin={isAdmin} />} />
          <Route path="/events" element={<Navigate to="/event-management" />} />
          {/* <Route path="/event-management" element={<EventManagementForm />} /> */}
          <Route path="/volunteer-event-match" element={<VolunteerMatchForm />} />

          <Route path="/profile" element={<Navigate to="/manage-profile" />} />
          <Route path="/manage-profile" element={<Profile />} />
          <Route path="/profile-form" element={<ProfileForm />} />
          <Route path="/volunteer-history" element={<VolunteerHistory />} />

          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
          <Route path="/admin-login" element={<AdminLoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />

          <Route path="/notifications" element={<NotificationDisplay isAdmin={isAdmin} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;