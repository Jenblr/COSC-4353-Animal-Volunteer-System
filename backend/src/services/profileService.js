const authService = require('../services/authService');
const { Profile, User } = require('../../models');

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
		{ value: 'Medication', label: 'Medication' },
		{ value: 'Organizing Shelter Donations', label: 'Organizing Shelter Donations' },
		{ value: 'Potty and Leash Training', label: 'Potty and Leash Training' },
		{ value: 'Taking Photos of Animals', label: 'Taking Photos of Animals' },
		{ value: 'Temporary Foster Care', label: 'Temporary Foster Care' }
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

const profileService = {
	getFormOptions: async () => {
		return formOptions;
	},

	getProfile: async (userId) => {
		try {
			console.log('Getting profile for user:', userId);
			
			const user = await User.findByPk(userId);
			if (!user) {
				return null;
			}
	
			const profile = await Profile.findOne({
				where: { userId },
				include: [{
					model: User,
					attributes: ['email', 'role'],
					as: 'User'
				}]
			});
	
			if (!profile) {
				return null;
			}
	
			// Return different profile structure based on user role
			return {
				fullName: profile.fullName,
				email: profile.User.email,
				role: profile.User.role,
				// Only include these fields for regular users
				...(profile.User.role !== 'admin' && {
					address1: profile.address1,
					address2: profile.address2,
					city: profile.city,
					state: profile.state,
					zipCode: profile.zipCode,
					skills: profile.skills,
					preferences: profile.preferences,
					availability: profile.availability
				})
			};
		} catch (error) {
			console.error('Error getting profile:', error);
			throw error;
		}
	},

    createProfile: async (userId, profileData) => {
        try {
            console.log('Creating profile for user:', userId);

            const existingProfile = await Profile.findOne({ where: { userId } });
            if (existingProfile) {
                console.log('Profile already exists for user:', userId);
                return { 
                    status: 400, 
                    message: 'Profile already exists' 
                };
            }

            console.log('Profile data to be saved:', profileData);
            
            const profile = await Profile.create({
                userId,
                ...profileData
            });

            console.log('Profile created:', profile.id);
            return { 
                status: 201, 
                message: 'Profile created successfully',
                profile 
            };
        } catch (error) {
            console.error('Error creating profile:', error);
            return { 
                status: 500, 
                message: 'Error creating profile',
                error: error.message 
            };
        }
    },

	updateProfile: async (userId, profileData) => {
		try {
			console.log('Updating profile for user:', userId);
			console.log('Update data:', profileData);
	
			const profile = await Profile.findOne({ where: { userId } });
			if (!profile) {
				console.log('No profile found for user:', userId);
				return { status: 404, message: 'Profile not found' };
			}
	
			const allowedUpdates = {
				skills: profileData.skills || profile.skills,
				preferences: profileData.preferences,
				availability: profileData.availability ? 
					profileData.availability.map(date => 
						typeof date === 'string' ? new Date(date) : date
					) : profile.availability
			};
	
			console.log('Applying updates:', allowedUpdates);
	
			await profile.update(allowedUpdates);
	
			return {
				status: 200,
				message: 'Profile updated successfully',
				profile: {
					...profile.toJSON(),
					availability: profile.availability.map(date => 
						date.toISOString()
					)
				}
			};
		} catch (error) {
			console.error('Error updating profile:', error);
			return { 
				status: 500, 
				message: 'Error updating profile',
				error: error.message 
			};
		}
	},

	finalizeRegistration: async (token, profileData) => {
		try {
			const tempUser = await authService.verifyTemporaryUserByToken(token);
			if (!tempUser) {
				console.log('Temporary user not found');
				return { status: 400, message: 'Invalid or expired registration attempt' };
			}

			const errors = validateProfile(profileData);
			if (Object.keys(errors).length > 0) {
				return { status: 400, message: 'Validation failed', errors };
			}

			// Create profile first
			const profileResult = await profileService.createProfile(tempUser.id, profileData);
			if (profileResult.status !== 201) {
				return profileResult;
			}

			// Then finalize registration
			const authResult = await authService.finalizeRegistration(tempUser.id);
			if (authResult.status !== 200) {
				return authResult;
			}

			return {
				status: 201,
				message: 'Registration finalized and profile created successfully',
				profile: profileResult.profile
			};
		} catch (error) {
			console.error('Error in finalizeRegistration:', error);
			return { status: 500, message: 'Error finalizing registration' };
		}
	},

	getAllProfiles: async () => {
		try {
			return await Profile.findAll();
		} catch (error) {
			console.error('Error getting all profiles:', error);
			return [];
		}
	}
};

module.exports = profileService;