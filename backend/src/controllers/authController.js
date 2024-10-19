const authService = require('../services/authService');

exports.register = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const response = authService.registerUser(email, password, role);
    if (response.status === 201) {
        return res.status(201).json({
            message: response.message,
            token: response.token, 
            needsProfile: response.needsProfile
        });
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

exports.getAllVolunteers = (req, res) => {
    try {
        const volunteers = authService.getAllVolunteers();
        return res.status(200).json(volunteers.map(v => ({
            id: v.id,
            email: v.email,
            fullName: v.fullName || v.email 
        })));
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching volunteers', error });
    }
};

exports.getRegisteredVolunteers = (req, res) => {
    try {
        const volunteers = authService.getRegisteredVolunteers();
        return res.status(200).json(volunteers.map(v => ({
            id: v.id,
            email: v.email,
            fullName: v.fullName || v.email 
        })));
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching registered volunteers', error });
    }
};