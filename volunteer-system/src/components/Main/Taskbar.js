import React from 'react';
import { Link } from 'react-router-dom'; // for SPA navigaiton
import '../../styles/Taskbar.css';
import logo from '../../images/AnimalShelterLogo.png'; 

const Taskbar = () => {
    return (
        <nav className="navbar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
                <span className="logo-text">Adopt-a-Companion Society</span>
            </div>
            <div className="taskbar">
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/calendar'>Calendar</Link></li>
                    <li><Link to='/profile'>Profile</Link></li>
                    <li><Link to='/notifications'>Notifications</Link></li>
                </ul>
            </div>
        </nav>
    );
};

export default Taskbar;