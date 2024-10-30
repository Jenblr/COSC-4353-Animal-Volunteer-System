const profileService = require('../services/profileService');

exports.getFormOptions = async (req, res) => {
    try {
        const formOptions = {
            states: [
                { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
                { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
                { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
                { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
                { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
                { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
                { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
                { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
                { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
                { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
                { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
                { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
                { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
                { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
                { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
                { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
                { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
                { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
                { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
                { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
                { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
                { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
                { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
                { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
                { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
            ],
            skills: [
                { value: 'Animal Care', label: 'Animal Care' },
                { value: 'Assisting Potential Adopters', label: 'Assisting Potential Adopters' },
                { value: 'Cleaning', label: 'Cleaning' },
                { value: 'Dog Walking', label: 'Dog Walking' },
                { value: 'Emergency Response', label: 'Emergency Response' },
                { value: 'Event Coordination', label: 'Event Coordination' },
                { value: 'Exercise', label: 'Exercise' },
                { value: 'Feeding', label: 'Feeding' },
                { value: 'Grooming', label: 'Grooming' },
                { value: 'Helping with Laundry', label: 'Helping with Laundry' },
                { value: 'Medication Administration', label: 'Medication Administration' },
                { value: 'Organizing Shelter Donations', label: 'Organizing Shelter Donations' },
                { value: 'Potty and Leash Training', label: 'Potty and Leash Training' },
                { value: 'Taking Photos of Animals', label: 'Taking Photos of Animals' },
                { value: 'Temporary Foster Care', label: 'Temporary Foster Care' }
            ]
        };

        res.status(200).json(formOptions);
    } catch (error) {
        console.error('Error getting form options:', error);
        res.status(500).json({ message: 'Failed to load form options' });
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
        console.log('Update profile request for user:', req.userId);
        console.log('Update data received:', req.body);

        const allowedData = {
            skills: req.body.skills,
            preferences: req.body.preferences,
            availability: req.body.availability
        };

        const result = await profileService.updateProfile(req.userId, allowedData);
        
        if (result.status === 200) {
            console.log('Profile updated successfully');
            res.status(200).json(result);
        } else {
            console.log('Profile update failed:', result.message);
            res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        console.error('Error in updateProfile controller:', error);
        res.status(500).json({ 
            message: 'Failed to update profile',
            error: error.message 
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        console.log('Getting profile for user:', req.userId);
        const profile = await profileService.getProfile(req.userId);
        
        if (!profile) {
            console.log('No profile found for user:', req.userId);
            return res.status(404).json({ 
                message: 'Profile not found' 
            });
        }

        console.log('Profile found:', profile);
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};