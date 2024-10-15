const request = require('supertest');
const express = require('express');
const profileRoutes = require('../../routes/profileRoutes');
const { verifyToken } = require('../../middleware/authMiddleware');
const profileService = require('../../services/profileService');

jest.mock('../../middleware/authMiddleware');
jest.mock('../../services/profileService');

const app = express();
app.use(express.json());
app.use('/profile', profileRoutes);

describe('Profile Routes', () => {
  beforeEach(() => {
    verifyToken.mockImplementation((req, res, next) => {
      req.userId = 'testUserId';
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    test('should return profile when it exists', async () => {
      const mockProfile = { userId: 'testUserId', fullName: 'John Doe' };
      profileService.getProfile.mockReturnValue(mockProfile);

      const response = await request(app).get('/profile');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockProfile);
      expect(profileService.getProfile).toHaveBeenCalledWith('testUserId');
    });

    test('should return 404 when profile does not exist', async () => {
      profileService.getProfile.mockReturnValue(null);

      const response = await request(app).get('/profile');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ message: 'Profile not found' });
      expect(profileService.getProfile).toHaveBeenCalledWith('testUserId');
    });
  });

  describe('POST /profile', () => {
    test('should create a new profile', async () => {
      const newProfile = {
        location: 'New York',
        skills: ['Dog walking', 'Cat sitting'],
        preferences: 'Weekends only',
        availability: ['2023-07-01', '2023-07-02']
      };
      profileService.createProfile.mockReturnValue({ status: 201, profile: newProfile });

      const response = await request(app)
        .post('/profile')
        .send(newProfile);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: 'Profile created successfully', profile: newProfile });
      expect(profileService.createProfile).toHaveBeenCalledWith('testUserId', newProfile.location, newProfile.skills, newProfile.preferences, newProfile.availability);
    });
  });

  describe('PUT /profile', () => {
    test('should update an existing profile', async () => {
      const updatedProfile = {
        location: 'Los Angeles',
        skills: ['Dog training', 'Pet grooming'],
        preferences: 'Mornings only',
        availability: ['2023-08-01', '2023-08-02']
      };
      profileService.updateProfile.mockReturnValue({ status: 200, profile: updatedProfile });

      const response = await request(app)
        .put('/profile')
        .send(updatedProfile);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Profile updated successfully', profile: updatedProfile });
      expect(profileService.updateProfile).toHaveBeenCalledWith('testUserId', updatedProfile.location, updatedProfile.skills, updatedProfile.preferences, updatedProfile.availability);
    });
  });
});