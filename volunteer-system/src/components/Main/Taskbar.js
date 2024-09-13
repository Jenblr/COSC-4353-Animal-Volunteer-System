import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Taskbar.css';
import logo from '../../images/AnimalShelterLogo.png'; 

const Taskbar = () => {
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
                    <li><Link to='/events'>Events</Link></li>
                    
                    {/* Dropdown for Profile */}
                    <li className="dropdown">
                        <Link to='/profile'>Profile</Link>
                        <ul className="dropdown-content">
                            <li><Link to='/login'>Log In</Link></li>
                            <li><Link to='/manage-profile'>Manage Profile</Link></li>
                            <li><Link to='/volunteer-history'>Volunteer History</Link></li>
                        </ul>
                    </li>

                    <li><Link to='/notifications'>Notifications</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Taskbar;
