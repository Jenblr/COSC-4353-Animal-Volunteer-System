//profileController.js
const profileService = require('../services/profileService');

exports.getProfile = (req, res) => {
    const userId = req.userId; 
    const profile = profileService.getProfile(userId);
    if (profile) {
        res.status(200).json(profile);
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
};

exports.createProfile = (req, res) => {
    const userId = req.userId;
    const { location, skills, preferences, availability } = req.body;
    
    const result = profileService.createProfile(userId, location, skills, preferences, availability);
    if (result.status === 201) {
        res.status(201).json({ message: 'Profile created successfully', profile: result.profile });
    } else {
        res.status(result.status).json({ message: result.message });
    }
};

exports.updateProfile = (req, res) => {
    const userId = req.userId;
    const { location, skills, preferences, availability } = req.body;
    
    const result = profileService.updateProfile(userId, location, skills, preferences, availability);
    if (result.status === 200) {
        res.status(200).json({ message: 'Profile updated successfully', profile: result.profile });
    } else {
        res.status(result.status).json({ message: result.message });
    }
};