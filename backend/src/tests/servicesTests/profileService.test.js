const profileService = require('../../services/profileService');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('Profile Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getFormOptions', () => {
        test('should return form options', async () => {
            const options = await profileService.getFormOptions();
            expect(options).toHaveProperty('states');
            expect(options).toHaveProperty('skills');
            expect(options.states.length).toBeGreaterThan(0);
            expect(options.skills.length).toBeGreaterThan(0);
        });
    });

    describe('getProfile', () => {
        test('should return user profile when found', async () => {
            const mockProfile = { userId: 1, fullName: 'Test User' };
            profileService.getProfile = jest.fn().mockResolvedValue(mockProfile);
        
            const profile = await profileService.getProfile(1);
            expect(profile).toEqual(mockProfile);
        });

        test('should return null when profile not found', async () => {
            profileService.getProfile = jest.fn().mockResolvedValue(null);
        
            const profile = await profileService.getProfile(999);
            expect(profile).toBeNull();
        });
    });

    describe('createProfile', () => {
        const mockProfileData = {
            fullName: 'New User',
            address1: 'Test Address',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            skills: ['Skill 1'],
            availability: ['2023-01-01']
        };
    
        beforeEach(() => {
            // Reset the mock before each test
            profileService.getProfile = jest.fn().mockResolvedValue(null);
        });
    
        test('should create a new profile successfully', async () => {
            const result = await profileService.createProfile(1, mockProfileData);
            expect(result.status).toBe(201);
            expect(result.message).toContain('Profile created successfully');
            expect(result.profile).toMatchObject({
                ...mockProfileData,
                availability: [expect.any(Date)]
            });
            expect(result.profile.availability[0].toISOString().split('T')[0]).toBe('2023-01-01');
        });
    
        test('should return error if profile already exists', async () => {
            profileService.getProfile = jest.fn().mockResolvedValue({ userId: 1 });
            
            const result = await profileService.createProfile(1, mockProfileData);
            expect(result.status).toBe(400);
            expect(result.message).toContain('Profile already exists');
        });
    
        test('should return validation errors for invalid data', async () => {
            const invalidData = { ...mockProfileData, fullName: '' };
            const result = await profileService.createProfile(1, invalidData);
            expect(result.status).toBe(400);
            expect(result.message).toContain('Validation failed');
            expect(result.errors).toHaveProperty('fullName');
        });
    });
    
    describe('updateProfile', () => {
        const mockProfileData = {
            fullName: 'Updated User',
            address1: 'New Address',
            city: 'New City',
            state: 'NS',
            zipCode: '54321',
            skills: ['Skill 2'],
            availability: ['2023-02-01']
        };

        test('should update an existing profile successfully', async () => {
            const result = await profileService.updateProfile(1, mockProfileData);
            expect(result.status).toBe(200);
            expect(result.message).toContain('Profile updated successfully');
            expect(result.profile).toMatchObject({
                ...mockProfileData,
                availability: [expect.any(Date)]
            });
            expect(result.profile.availability[0].toISOString().split('T')[0]).toBe('2023-02-01');
        });

        test('should return error if profile not found', async () => {
            const result = await profileService.updateProfile(999, mockProfileData);
            expect(result.status).toBe(404);
            expect(result.message).toContain('Profile not found');
        });

        test('should return validation errors for invalid data', async () => {
            const invalidData = { ...mockProfileData, fullName: '' };
            const result = await profileService.updateProfile(1, invalidData);
            expect(result.status).toBe(400);
            expect(result.message).toContain('Validation failed');
            expect(result.errors).toHaveProperty('fullName');
        });
    });

    describe('finalizeRegistration', () => {
        const mockProfileData = {
            fullName: 'New User',
            address1: 'Test Address',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            skills: ['Skill 1'],
            availability: ['2023-01-01']
        };

        test('should finalize registration successfully', async () => {
            authService.verifyTemporaryUserByToken.mockReturnValue({ id: 1, email: 'test@example.com' });
            authService.finalizeRegistration.mockReturnValue({ status: 200, message: 'Registration finalized' });
            
            const result = await profileService.finalizeRegistration('validToken', mockProfileData);
            expect(result.status).toBe(201);
            expect(result.message).toContain('Registration finalized');
            expect(result.profile).toMatchObject({
                ...mockProfileData,
                availability: [expect.any(Date)],
                userId: 1,
                email: 'test@example.com'
            });
            expect(result.profile.availability[0].toISOString().split('T')[0]).toBe('2023-01-01');
        });

        test('should return error for invalid token', async () => {
            authService.verifyTemporaryUserByToken.mockReturnValue(null);
            
            const result = await profileService.finalizeRegistration('invalidToken', mockProfileData);
            expect(result.status).toBe(400);
            expect(result.message).toContain('Invalid or expired registration attempt');
        });

        test('should return validation errors for invalid data', async () => {
            authService.verifyTemporaryUserByToken.mockReturnValue({ id: 1, email: 'test@example.com' });
            
            const invalidData = { ...mockProfileData, fullName: '' };
            const result = await profileService.finalizeRegistration('validToken', invalidData);
            expect(result.status).toBe(400);
            expect(result.message).toContain('Validation failed');
            expect(result.errors).toHaveProperty('fullName');
        });

        test('should handle authService finalizeRegistration failure', async () => {
            authService.verifyTemporaryUserByToken.mockReturnValue({ id: 1, email: 'test@example.com' });
            authService.finalizeRegistration.mockReturnValue({ status: 500, message: 'Internal server error' });
            
            const result = await profileService.finalizeRegistration('validToken', mockProfileData);
            expect(result.status).toBe(500);
            expect(result.message).toContain('Internal server error');
        });
    });
});