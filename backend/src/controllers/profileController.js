const profileService = require('../services/profileService');

exports.getFormOptions = async (req, res) => {
    try {
        const options = await profileService.getFormOptions();
        res.status(200).json(options);
    } catch (error) {
        console.error('Error in getFormOptions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.finalizeRegistration = async (req, res) => {
    try {
        const { token, ...profileData } = req.body;
        console.log('Received finalize registration request:', { token, profileData });
        const result = await profileService.finalizeRegistration(token, profileData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in finalizeRegistration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profileData = req.body;
        const result = await profileService.updateProfile(userId, profileData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId; 
        const profile = await profileService.getProfile(userId);
        if (profile) {
            res.status(200).json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
