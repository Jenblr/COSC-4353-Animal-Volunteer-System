const profileController = require('../../controllers/profileController');
const profileService = require('../../services/profileService');

jest.mock('../../services/profileService');

describe('ProfileController', () => {
    describe('getProfile', () => {
        it('should return a profile', async () => {
            const req = { userId: '1' };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            profileService.getProfile.mockReturnValue({
                userId: '1',
                fullName: 'John Doe'
            });

            await profileController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                fullName: 'John Doe'
            }));
        });

        it('should return 404 if profile not found', async () => {
            const req = { userId: '999' };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            profileService.getProfile.mockReturnValue(null);

            await profileController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Profile not found' });
        });
    });

    describe('createProfile', () => {
        it('should create a new profile', async () => {
            const req = {
                userId: '2',
                body: {
                    fullName: 'Jane Smith',
                    address1: '456 Elm St',
                    city: 'Other City',
                    state: 'NY',
                    zipCode: '67890',
                    skills: ['Event Planning'],
                    preferences: 'Cats',
                    availability: ['2023-08-01']
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            profileService.createProfile.mockReturnValue({
                status: 201,
                profile: req.body
            });

            await profileController.createProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Profile created successfully',
                profile: expect.objectContaining({ fullName: 'Jane Smith' })
            }));
        });
    });

    describe('updateProfile', () => {
        it('should update an existing profile', async () => {
            const req = {
                userId: '1',
                body: {
                    fullName: 'John Updated',
                    address1: '789 New St'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            profileService.updateProfile.mockReturnValue({
                status: 200,
                profile: { ...req.body, userId: '1' }
            });

            await profileController.updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Profile updated successfully',
                profile: expect.objectContaining({ fullName: 'John Updated' })
            }));
        });
    });
});