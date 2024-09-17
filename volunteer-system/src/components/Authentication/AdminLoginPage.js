import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/LoginPage.css';

const AdminLoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Mock admin user data
    const mockAdmin = { username: 'admin', password: 'adminpassword' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation = user leaves empty fields
        if (!username || !password) {
            setError('Please enter a username and password');
            setLoading(false);
            return;
        }

        // Simulating login with mock admin data
        setTimeout(() => {
            if (username === mockAdmin.username && password === mockAdmin.password) {
                localStorage.setItem('token', 'adminToken'); 
                localStorage.setItem('role', 'admin'); 
                setIsLoggedIn(true); 
                setIsAdmin(true); 
                navigate('/home'); 
            } else {
                setError('Invalid credentials');
            }
            setLoading(false);
        }, 1000); // Simulate 1-second delay
    };

    // Function to fill in demo admin credentials
    const fillDemoAdminCredentials = () => {
        setUsername('admin');
        setPassword('adminpassword');
        setError('');
    };

    return (
        <div className="login-container admin-login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button admin-login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Admin Log In'}
                </button>

                <button type="button" onClick={fillDemoAdminCredentials} className="demo-button">
                    Use Demo Admin Credentials
                </button>

                {/* If user accidentally clicks admin login */}
                <div className="additional-links">
                    <p><Link to="/login">Back to User Login</Link></p>
                </div>
            </form>
        </div>
    );
};

export default AdminLoginPage;