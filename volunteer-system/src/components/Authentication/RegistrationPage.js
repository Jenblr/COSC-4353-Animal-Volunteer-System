import React, { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/RegistrationPage.css';

const RegistrationPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const validateEmail = (email) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		if (!validateEmail(e.target.value)) {
		setEmailError('Please enter a valid email address');
		} else {
		setEmailError('');
		}
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		if (e.target.value.length < 8) {
		setPasswordError('Password must be at least 8 characters long');
		} else {
		setPasswordError('');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
	  
		if (validateEmail(email) && password.length >= 8 && password === confirmPassword) {
			try {
				const response = await axios.post('http://localhost:5000/api/auth/register', {
				email: email, 
				password,
				});
		
				if (response.status === 201) {
				// Store the token in localStorage
				localStorage.setItem('registrationToken', response.data.token);
				navigate('/profile-form');
				}
			} catch (error) {
				setError(error.response?.data?.message || 'Registration failed');
			} finally {
				setLoading(false);
			}
			} else {
			if (!validateEmail(email)) {
				setEmailError('Please enter a valid email address');
			}
			if (password.length < 8) {
				setPasswordError('Password must be at least 8 characters long');
			}
			if (password !== confirmPassword) {
				setPasswordError('Passwords do not match');
			}
			setLoading(false);
		}
	};

	return (
		<div className="registration-container">
		<form className="registration-form" onSubmit={handleSubmit}>
			<h2>Volunteer Registration</h2>
			<div className="form-group">
			<label htmlFor="email">Email:</label>
			<input type="email" id="email" value={email} onChange={handleEmailChange} required />
			{emailError && <span className="error-message">{emailError}</span>}
			</div>
			<div className="form-group">
			<label htmlFor="password">Password:</label>
			<input type="password" id="password" value={password} onChange={handlePasswordChange} required />
			</div>
			<div className="form-group">
			<label htmlFor="confirm-password">Confirm Password:</label>
			<input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
			{passwordError && <span className="error-message">{passwordError}</span>}
			</div>
			{error && <div className="error-message">{error}</div>}
			<button type="submit" className="register-button" disabled={loading}>
			{loading ? 'Registering...' : 'Register'}
			</button>
		</form>
		</div>
	);
};

export default RegistrationPage;