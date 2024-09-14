import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/LoginPage.css';

const AdminLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        try {
            const response = await fetch('/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login = store token and redirect to home
                console.log('Login successful:', data);
                navigate('/home');
            } else { // Username and password doesn't match what is stored in database
                setError(data.message || 'Invalid credentials');
            }

        } catch (error) { // Catches network errors
            console.error('Error logging in:', error);
            setError('An error occurred. Please try again.');

        } finally {
            setLoading(false);
        }
    };


    return (
        <div className = "login-container admin-login">
            <form className= "login-form" onSubmit={handleSubmit}>
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
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button admin-login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Admin Log In'}
                </button>

                {/* If user accidentally clicks admin login */}
                <div className="additional-links">
                    <p><Link to="/login">Back to User Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default AdminLoginPage;