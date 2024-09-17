import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setIsAdmin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock user data
    const mockUsers = [
        { email: 'demo@example.com', password: 'demopassword' },
        { email: 'user@example.com', password: 'userpassword' },
    ];

    // Email validation & error-handling
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Mocking login with demo user data
        setTimeout(() => {
            const user = mockUsers.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('token', 'userToken'); 
                localStorage.setItem('role', user.role); 
                setIsLoggedIn(true); 
                if (user.role === 'admin') {
                    setIsAdmin(true); 
                }
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
            setLoading(false);
        }, 1000); // Simulate a 1-second delay
    };

    // Function to fill in demo user credentials
    const fillDemoCredentials = () => {
        setEmail('demo@example.com');
        setPassword('demopassword');
        setEmailError('');
    };

    const [showPassword, setShowPassword] = useState(false);

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

                <button type="button" onClick={fillDemoCredentials} className="demo-button">
                    Use Demo User
                </button>

                <div className="additional-links">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                    <p><Link to="/admin-login">Admin? Click here</Link></p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;