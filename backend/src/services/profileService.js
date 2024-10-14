// Hard-coded profiles
const profiles = [
    {
        userId: '1',
        fullName: 'John Doe',
        address1: '123 Main St',
        address2: 'Apt 4B',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['Animal Care', 'Feeding'],
        preferences: 'Prefer working with dogs',
        availability: ['2023-06-01', '2023-06-15', '2023-06-30']
    },
    {
        userId: '2',
        fullName: 'Jane Smith',
        address1: '456 Elm St',
        address2: '',
        city: 'Othertown',
        state: 'NY',
        zipCode: '67890',
        skills: ['Grooming', 'Medication Administration'],
        preferences: 'Available on weekends',
        availability: ['2023-07-01', '2023-07-15', '2023-07-30']
    }
];

const validateProfile = (profileData) => {
    const errors = {};

    if (!profileData.fullName.trim() || profileData.fullName.length > 50) 
        errors.fullName = 'Full Name is required and must be 50 characters or less';
    
    if (!profileData.address1.trim() || profileData.address1.length > 100) 
        errors.address1 = 'Address 1 is required and must be 100 characters or less';
    
    if (profileData.address2 && profileData.address2.length > 100) 
        errors.address2 = 'Address 2 must be 100 characters or less';
    
    if (!profileData.city.trim() || profileData.city.length > 100) 
        errors.city = 'City is required and must be 100 characters or less';
    
    if (!profileData.state) 
        errors.state = 'State selection is required';
    
    if (!profileData.zipCode.trim() || profileData.zipCode.length < 5 || profileData.zipCode.length > 9) 
        errors.zipCode = 'Zip code must be between 5 and 9 characters';
    
    if (profileData.skills.length === 0) 
        errors.skills = 'At least one skill must be selected';
    
    if (profileData.availability.length === 0) 
        errors.availability = 'At least one date must be selected for availability';

    return errors;
};

exports.getProfile = (userId) => {
    return profiles.find(profile => profile.userId === String(userId));
};


exports.createProfile = (userId, profileData) => {
    if (profiles.some(profile => profile.userId === String(userId))) {
        return { status: 400, message: 'Profile already exists' };
    }

    const validationErrors = validateProfile(profileData);
    if (Object.keys(validationErrors).length > 0) {
        return { status: 400, message: 'Validation failed', errors: validationErrors };
    }

    const newProfile = { userId: String(userId), ...profileData };
    profiles.push(newProfile); 

    console.log('New profile created:', newProfile);

    return { status: 201, profile: newProfile };
};

exports.updateProfile = (userId, profileData) => {
    console.log('Updating profile for userId:', userId);
    const profileIndex = profiles.findIndex(profile => profile.userId === userId);
    if (profileIndex === -1) {
        return { status: 404, message: 'Profile not found' };
    }

    const validationErrors = validateProfile(profileData);
    if (Object.keys(validationErrors).length > 0) {
        return { status: 400, message: 'Validation failed', errors: validationErrors };
    }

    const updatedProfile = { userId, ...profileData };
    console.log('Profile updated:', updatedProfile);

    return { status: 200, profile: updatedProfile };
};




