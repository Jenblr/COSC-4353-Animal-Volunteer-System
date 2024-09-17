import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Taskbar.css';
import logo from '../../images/AnimalShelterLogo.png'; 

const Taskbar = ({ isAdmin, isLoggedIn, setIsLoggedIn, setIsAdmin }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setIsLoggedIn(true);
            setIsAdmin(role === 'admin');
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [setIsLoggedIn, setIsAdmin]);

    {/* For user specific links, non-logged in users cannot access unless logged in first */}
    const handleAuthenticatedLink = (event, path) => {
        if (!isLoggedIn) {
            event.preventDefault();
            navigate('/login');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/login');
    }

    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <span className="logo-text">Adopt-a-Companion Society</span>
            </div>
            <div className="taskbar">
                <ul>
                    <li><Link to='/home'>Home</Link></li>
                    <li><Link to='/calendar'>Calendar</Link></li>

                    {/* Events viewable only by Admin users */}
                    {isAdmin && (
                        <li className="dropdown">
                            <Link to='/events'>Events</Link>
                            <ul className="dropdown-content">
                                <li><Link to='/event-management'>Event Management</Link></li> 
                                <li><Link to='/volunteer-event-match' onClick={(e) => handleAuthenticatedLink(e, '/volunteer-event-match')}>Volunteer Event Match</Link></li>
                            </ul>
                        </li>
                    )}
                    
                    <li className="dropdown">
                        <Link to='/profile' onClick={(e) => handleAuthenticatedLink(e, '/profile')}>Profile</Link>
                        <ul className="dropdown-content">
                            {!isLoggedIn && <li><Link to='/login'>Log In</Link></li>}
                            {isLoggedIn && (
                                <>
                                    <li><Link to='/manage-profile'>Manage Profile</Link></li>
                                    <li><Link to='/volunteer-history'>Volunteer History</Link></li>
                                    <li><Link to='/home' onClick={handleLogout}>Log Out</Link></li>
                                </>
                            )}
                        </ul>
                    </li>

                    <li><Link to='/notifications' onClick={(e) => handleAuthenticatedLink(e, '/notifications')}>Notifications</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Taskbar;