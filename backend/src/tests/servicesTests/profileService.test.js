const profileService = require('../../services/profileService');

let profiles = [];

beforeEach(() => {
    profiles = [
        {
            userId: '1',
            fullName: 'John Doe',
            address1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            skills: ['Animal Care'],
            preferences: 'Dogs',
            availability: ['2023-07-01']
        }
    ];
});

describe('ProfileService', () => {
    describe('getProfile', () => {
        it('should return a profile for an existing user', () => {
            const profile = profileService.getProfile('1');
            expect(profile).toBeDefined();
            expect(profile.fullName).toBe('John Doe');
        });

        it('should return undefined for a non-existent user', () => {
            const profile = profileService.getProfile('999');
            expect(profile).toBeUndefined();
        });
    });

    beforeEach(() => {
        profiles.length = 0;  
    });

    describe('createProfile', () => {
        it('should create a new profile', () => {
            const newProfile = {
                fullName: 'New User',
                address1: '789 New St',
                address2: 'Apt 3',
                city: 'Newtown',
                state: 'NT',
                zipCode: '54321',
                skills: ['New Skill'],
                preferences: 'New preferences',
                availability: ['2023-08-01', '2023-08-15', '2023-08-30']
            };
            const response = profileService.createProfile('3', newProfile);
            expect(response.status).toBe(201);
            expect(response.profile.fullName).toBe('New User');
        });

        it('should return 400 if profile already exists', () => {
            const existingProfile = {
                fullName: 'Existing User',
                address1: '123 Existing St',
                city: 'Existingtown',
                state: 'EX',
                zipCode: '12345',
                skills: ['Existing Skill'],
                preferences: 'Existing preferences',
                availability: ['2023-09-01']
            };
            const response = profileService.createProfile('1', existingProfile);
            expect(response.status).toBe(400);
            expect(response.message).toBe('Profile already exists');
        });
    });

    describe('updateProfile', () => {
        it('should update an existing profile', () => {
            const updatedProfile = {
                fullName: 'John Updated',
                address1: '789 New St',
                city: 'New City',
                state: 'NJ',
                zipCode: '54321',
                skills: ['Animal Care', 'Event Planning'],
                preferences: 'Cats and Dogs',
                availability: ['2023-07-01', '2023-08-01']
            };
            const response = profileService.updateProfile('1', updatedProfile);
            expect(response.status).toBe(200);
            expect(response.profile.fullName).toBe('John Updated');
        });

        it('should return 404 if profile not found', () => {
            const updatedProfile = {
                fullName: 'Non-existent User'
            };
            const response = profileService.updateProfile('999', updatedProfile);
            expect(response.status).toBe(404);
            expect(response.message).toBe('Profile not found');
        });
    });
});