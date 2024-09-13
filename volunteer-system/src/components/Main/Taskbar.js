import React from 'react';
import { Link } from 'react-router-dom'; // for SPA navigaiton
import '../../styles/Taskbar.css';
import logo from '../../images/AnimalShelterLogo.png'; 
import firstBanner from '../../images/AnimalShelter_Home_Banner.png'; 
import whoAreWe from '../../images/AnimalShelter_WhoAreWe.png';

const Taskbar = () => {
    return (
        <div>
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

            {/* Banner styling under taskbar for home page*/}
            <div className="banner-container">
                <img src={firstBanner} alt="FirstBanner" className="firstBanner" />
            </div>

            {/* Who Are We statement */}
            <div className="whoAreWe-container">
                <img src={whoAreWe} alt="Who Are We" className="who-Are-We" />
            </div>
        </div>
    );
};

export default Taskbar;