import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import '../../styles/LoginPage.css';

const AdminLoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please enter an email and password');
            setLoading(false);
            return;
        }

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
    };

    // Function to fill in demo admin credentials
    const fillDemoAdminCredentials = () => {
        setEmail('admin@example.com');
        setPassword('adminpassword');
        setError('');
    };

    return (
        <div className="login-container admin-login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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