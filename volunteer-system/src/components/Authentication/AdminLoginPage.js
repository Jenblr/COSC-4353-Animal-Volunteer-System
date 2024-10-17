import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
<<<<<<< HEAD
import '../../styles/LoginPage.css';

const AdminLoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [username, setUsername] = useState('');
=======
import axios from 'axios';
import '../../styles/LoginPage.css';

const AdminLoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [email, setEmail] = useState('');
>>>>>>> origin/JenniferN
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

<<<<<<< HEAD
    // Mock admin user data
    const mockAdmin = { username: 'admin', password: 'adminpassword' };

=======
>>>>>>> origin/JenniferN
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

<<<<<<< HEAD
        // Basic validation = user leaves empty fields
        if (!username || !password) {
            setError('Please enter a username and password');
=======
        if (!email || !password) {
            setError('Please enter an email and password');
>>>>>>> origin/JenniferN
            setLoading(false);
            return;
        }

<<<<<<< HEAD
        // Login using mock admin data
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
=======
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            const { token, role } = response.data;

            if (role === 'admin') {
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                setIsLoggedIn(true);
                setIsAdmin(true);
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
>>>>>>> origin/JenniferN
    };

    // Function to fill in demo admin credentials
    const fillDemoAdminCredentials = () => {
<<<<<<< HEAD
        setUsername('admin');
=======
        setEmail('admin@example.com');
>>>>>>> origin/JenniferN
        setPassword('adminpassword');
        setError('');
    };

    return (
        <div className="login-container admin-login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className="form-group">
<<<<<<< HEAD
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
=======
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
>>>>>>> origin/JenniferN
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