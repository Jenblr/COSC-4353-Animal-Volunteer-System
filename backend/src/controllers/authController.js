/* 'authController.js' file:
- Handles HTTP requests and responses
- Calls on service functions
*/

const authService = require('../services/authService');

exports.register = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = authService.registerUser(email, password, role);
    if (response.status === 201) {
        return res.status(201).json({ message: 'User registered successfully', user: response.user });
    } else {
        return res.status(response.status).json({ message: response.message });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const response = authService.loginUser(email, password);
    if (response.status === 200) {
        return res.status(200).json({ token: response.token, role: response.role });
    } else {
        return res.status(response.status).json({ message: response.message });
    }
};