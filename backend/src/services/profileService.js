// //profileService.js


// // Hard-coded profiles
// const profiles = [
//     {
//         userId: '1',
//         fullName: 'John Doe',
//         address1: '123 Main St',
//         address2: 'Apt 4B',
//         city: 'Anytown',
//         state: 'CA',
//         zipCode: '12345',
//         skills: ['Animal Care', 'Feeding'],
//         preferences: 'Prefer working with dogs',
//         availability: ['2023-06-01', '2023-06-15', '2023-06-30']
//     },
//     {
//         userId: '2',
//         fullName: 'Jane Smith',
//         address1: '456 Elm St',
//         address2: '',
//         city: 'Dallas',
//         state: 'TX',
//         zipCode: '67890',
//         skills: ['Grooming', 'Cleaning','Medication Administration'],
//         preferences: 'Available on weekends',
//         availability: ['2024-10-15', '2024-11-01', '2024-11-10']
//     },
//     {
//         userId: '3',
//         fullName: 'Lara Jason',
//         address1: '714 Melbourne Dr',
//         address2: '',
//         city: 'San Antonio',
//         state: 'TX',
//         zipCode: '67890',
//         skills: ['Grooming', 'Cleaning','Medication'],
//         preferences: 'Available on weekends',
//         availability: ['2023-07-01', '2023-07-15', '2024-11-01']
//     }
// ];

// const validateProfile = (profileData) => {
//     const errors = {};

//     if (!profileData.fullName.trim() || profileData.fullName.length > 50) 
//         errors.fullName = 'Full Name is required and must be 50 characters or less';
    
//     if (!profileData.address1.trim() || profileData.address1.length > 100) 
//         errors.address1 = 'Address 1 is required and must be 100 characters or less';
    
//     if (profileData.address2 && profileData.address2.length > 100) 
//         errors.address2 = 'Address 2 must be 100 characters or less';
    
//     if (!profileData.city.trim() || profileData.city.length > 100) 
//         errors.city = 'City is required and must be 100 characters or less';
    
//     if (!profileData.state) 
//         errors.state = 'State selection is required';
    
//     if (!profileData.zipCode.trim() || profileData.zipCode.length < 5 || profileData.zipCode.length > 9) 
//         errors.zipCode = 'Zip code must be between 5 and 9 characters';
    
//     if (profileData.skills.length === 0) 
//         errors.skills = 'At least one skill must be selected';
    
//     if (profileData.availability.length === 0) 
//         errors.availability = 'At least one date must be selected for availability';

//     return errors;
// };

// exports.getProfile = (userId) => {
//     return profiles.find(profile => profile.userId === String(userId));
// };
// exports.getAllProfiles = () => {
//     return profiles; 
//   };

// /*exports.createProfile = (userId, profileData) => {
//     if (profiles.some(profile => profile.userId === String(userId))) {
//         return { status: 400, message: 'Profile already exists' };
//     }

//     const validationErrors = validateProfile(profileData);
//     if (Object.keys(validationErrors).length > 0) {
//         return { status: 400, message: 'Validation failed', errors: validationErrors };
//     }

//     const newProfile = { userId: String(userId), ...profileData };
//     profiles.push(newProfile); 

//     console.log('New profile created:', newProfile);

//     return { status: 201, profile: newProfile };
// };*/

// exports.createProfile = (userId, profileData) => {
//     console.log('Creating profile for userId:', userId);
//     if (profiles.some(profile => profile.userId === String(userId))) {
//         console.log('Profile already exists for userId:', userId);
//         return { status: 400, message: 'Profile already exists' };
//     }

//     const validationErrors = validateProfile(profileData);
//     if (Object.keys(validationErrors).length > 0) {
//         return { status: 400, message: 'Validation failed', errors: validationErrors };
//     }

//     const newProfile = { userId: String(userId), ...profileData };
//     profiles.push(newProfile); 

//     console.log('New profile created:', newProfile);

//     return { status: 201, profile: newProfile };
// };

// exports.updateProfile = (userId, profileData) => {
//     console.log('Updating profile for userId:', userId);
//     const profileIndex = profiles.findIndex(profile => profile.userId === userId);
//     if (profileIndex === -1) {
//         return { status: 404, message: 'Profile not found' };
//     }

//     const validationErrors = validateProfile(profileData);
//     if (Object.keys(validationErrors).length > 0) {
//         return { status: 400, message: 'Validation failed', errors: validationErrors };
//     }

//     const updatedProfile = { userId, ...profileData };
//     console.log('Profile updated:', updatedProfile);

//     return { status: 200, profile: updatedProfile };
// };
//profileService.js
const profiles = [
    {
      userId: '1',
      fullName: 'John Doe',
      address1: '111 Main St',
      address2: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      skills: ['Cleaning', 'Dog Walking'],
      preferences: 'Prefer working with dogs',
      availability: ['2024-06-15', '2024-07-01', '2024-07-15']
    },
    {
      userId: '2',
      fullName: 'Jane Smith',
      address1: '222 Elm St',
      address2: '',
      city: 'Dogville',
      state: 'NY',
      zipCode: '67890',
      skills: ['Medication', 'Helping with laundry'],
      preferences: 'Available on weekends',
      availability: ['2024-06-15', '2024-07-01', '2024-07-15']
    },
    {
      userId: '3',
      fullName: 'Bob Johnson',
      address1: '333 Oak Ave',
      address2: 'Suite 100',
      city: 'Petsburg',
      state: 'TX',
      zipCode: '54321',
      skills: ['Cleaning', 'Grooming','Emergency Response'],
      preferences: 'Willing to help with any task',
      availability: ['2024-06-15', '2024-06-30', '2024-07-15']
    },
    {
        userId: '4',
        fullName: 'Alice Brown',
        address1: '555 Vet Street',
        address2: '',
        city: 'Petsburg',
        state: 'TX',
        zipCode: '54321',
        skills: ['Medication', 'Emergency Response', 'Animal Care'],
        preferences: 'Experienced in emergency animal care',
        availability: ['2024-06-30', '2024-07-15', '2024-07-30']
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
exports.getAllProfiles = () => {
    return profiles; 
  };


exports.createProfile = (userId, profileData) => {
    console.log('Creating profile for userId:', userId);
    if (profiles.some(profile => profile.userId === String(userId))) {
        console.log('Profile already exists for userId:', userId);
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