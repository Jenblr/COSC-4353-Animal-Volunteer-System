import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
<<<<<<< HEAD
=======
import axios from 'axios';
>>>>>>> origin/JenniferN
import '../../styles/LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Email validation & error-handling
    const validateEmail = (email) => {
<<<<<<< HEAD
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
=======
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
>>>>>>> origin/JenniferN
        return re.test(String(email).toLowerCase());
    };

    const handleEmailValue = (e) => {
        setEmail(e.target.value);
        if (!validateEmail(e.target.value)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

<<<<<<< HEAD
        // Send POST request to login endpoint
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            setIsLoggedIn(true);
            if (data.role === 'admin') setIsAdmin(true);
            navigate('/home');
            } else {
            setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Error occurred during login');
        }
        setLoading(false);
    };

    // Function to fill in demo user credentials
    const fillDemoCredentials = () => {
        setEmail('demo@example.com');
        setPassword('demopassword');
        setEmailError('');
=======
        // Basic validation
        if (!email || !password) {
            setError('Please enter an email and password');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: email, 
                password
            });

            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            setIsLoggedIn(true);
            setIsAdmin(role === 'admin');
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
>>>>>>> origin/JenniferN
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Volunteer Login</h2>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailValue}
                        required
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-icon"
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>

<<<<<<< HEAD
                <button type="button" onClick={fillDemoCredentials} className="demo-button">
                    Use Demo User
                </button>

=======
>>>>>>> origin/JenniferN
                <div className="additional-links">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                    <p><Link to="/admin-login">Admin? Click here</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;