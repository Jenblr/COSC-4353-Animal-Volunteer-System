const authService = require('../services/authService');

const profiles = [];

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
        { value: 'Feeding', label: 'Feeding' },
        { value: 'Exercise', label: 'Exercise' },
        { value: 'Grooming', label: 'Grooming' },
        { value: 'Potty and Leash Training', label: 'Potty and Leash Training' },
        { value: 'Event Coordination', label: 'Event Coordination' },
        { value: 'Temporary Foster Care', label: 'Temporary Foster Care' },
        { value: 'Dog Walking', label: 'Dog Walking' },
        { value: 'Taking Photos of Animals', label: 'Taking Photos of Animals' },
        { value: 'Organizing Shelter Donations', label: 'Organizing Shelter Donations' },
        { value: 'Helping with Laundry', label: 'Helping with Laundry' },
        { value: 'Cleaning', label: 'Cleaning' },
        { value: 'Medication', label: 'Medication' },
        { value: 'Assisting Potential Adopters', label: 'Assisting Potential Adopters' },
        { value: 'Emergency Response', label: 'Emergency Response' }
    ]
};

const validateProfile = (profileData) => {
    const errors = {};
    if (!profileData.fullName) errors.fullName = 'Full Name is required';
    if (!profileData.address1) errors.address1 = 'Address 1 is required';
    if (!profileData.city) errors.city = 'City is required';
    if (!profileData.state) errors.state = 'State is required';
    if (!profileData.zipCode) errors.zipCode = 'Zip Code is required';
    if (!profileData.skills || profileData.skills.length === 0) errors.skills = 'At least one skill is required';
    if (!profileData.availability || profileData.availability.length === 0) errors.availability = 'At least one availability date is required';
    return errors;
};

exports.getFormOptions = async () => {
    return formOptions;
};

exports.getProfile = async (userId) => {
    return profiles.find(profile => profile.userId === userId);
};

exports.createProfile = async (userId, profileData) => {
    const existingProfile = await this.getProfile(userId);
    if (existingProfile) {
        return { status: 400, message: 'Profile already exists' };
    }

    const errors = validateProfile(profileData);
    if (Object.keys(errors).length > 0) {
        return { status: 400, message: 'Validation failed', errors };
    }

    const parsedAvailability = profileData.availability.map(date => new Date(date));

    const newProfile = { 
        userId, 
        ...profileData,
        availability: parsedAvailability
    };
    profiles.push(newProfile);
    return { status: 201, message: 'Profile created successfully', profile: newProfile };
};

exports.updateProfile = async (userId, profileData) => {
    const profileIndex = profiles.findIndex(profile => profile.userId === userId);
    if (profileIndex === -1) {
        return { status: 404, message: 'Profile not found' };
    }

    const errors = validateProfile(profileData);
    if (Object.keys(errors).length > 0) {
        return { status: 400, message: 'Validation failed', errors };
    }
    const parsedAvailability = profileData.availability.map(date => new Date(date));

    const updatedProfile = { 
        userId, 
        ...profileData,
        availability: parsedAvailability
    };
    profiles[profileIndex] = updatedProfile;
    return { status: 200, message: 'Profile updated successfully', profile: updatedProfile };
};

exports.finalizeRegistration = async (token, profileData) => {
    // Verify the temporary user
    const tempUser = authService.verifyTemporaryUserByToken(token);
    if (!tempUser) {
        console.log('Temporary user not found');
        return { status: 400, message: 'Invalid or expired registration attempt' };
    }

    const errors = validateProfile(profileData);
    if (Object.keys(errors).length > 0) {
        return { status: 400, message: 'Validation failed', errors };
    }

    const parsedAvailability = profileData.availability.map(date => new Date(date));

    const newProfile = { 
        userId: tempUser.id, // Use the id from the temporary user
        email: tempUser.email, // Use the email from the temporary user
        ...profileData,
        availability: parsedAvailability
    };
    profiles.push(newProfile);

    const authResult = authService.finalizeRegistration(tempUser.id);
    if (authResult.status !== 200) {
        return authResult;
    }

    return { status: 201, message: 'Registration finalized and profile created successfully', profile: newProfile };
};