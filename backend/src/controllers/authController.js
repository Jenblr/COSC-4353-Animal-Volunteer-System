/* 'authController.js' file:
- Handles HTTP requests and responses
- Calls on service functions
*/

const authService = require('../services/authService');

exports.register = (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const newUser = authService.registerUser(username, password, role);
        return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;

    try {
        const token = authService.loginUser(username, password);
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};