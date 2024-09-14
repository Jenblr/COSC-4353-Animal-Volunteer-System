import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Taskbar.css';
import logo from '../../images/AnimalShelterLogo.png'; 

const Taskbar = ({ isAdmin, isLoggedIn }) => {
    const navigate = useNavigate();

    {/* For user specific links, non-logged in users cannot access unless logged in first */}
    const handleAuthenticatedLink = (event, path) => {
        if (!isLoggedIn) {
            event.preventDefault();
            navigate('/login');
        }
    }

    return (
        <nav className="navbar">
            {/* Organization's logo for left side of taskbar */}
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <span className="logo-text">Adopt-a-Companion Society</span>
            </div>
            {/* Taskbar links */}
            <div className="taskbar">
                <ul>
                    <li><Link to='/home'>Home</Link></li>
                    <li><Link to='/calendar'>Calendar</Link></li>

                    {/* Dropdown for Events */}
                    <li className="dropdown">
                        <Link to='/events'>Events</Link>
                        <ul className="dropdown-content">
                        {isAdmin && <li><Link to='/event-management'>Event Management</Link></li>} {/* Only admin can create and manage events */}
                        <li><Link to='/volunteer-event-match' onClick={(e) => handleAuthenticatedLink(e, '/volunteer-event-match')}>Volunteer Event Match</Link></li>
                        </ul>
                    </li>
                    
                    {/* Dropdown for Profile */}
                    <li className="dropdown">
                        <Link to='/profile' onClick={(e) => handleAuthenticatedLink(e, '/profile')}>Profile</Link>
                        <ul className="dropdown-content">
                            {!isLoggedIn && <li><Link to='/login'>Log In</Link></li>}
                            {/* Only users can see the following menu options for Profile AFTER logging in */}
                            {isLoggedIn && (
                                <>
                                    <li><Link to='/manage-profile'>Manage Profile</Link></li>
                                    <li><Link to='/volunteer-history'>Volunteer History</Link></li>
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