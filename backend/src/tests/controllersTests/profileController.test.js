const profileController = require('../../controllers/profileController');
const profileService = require('../../services/profileService');

jest.mock('../../services/profileService');

describe('Profile Controller', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('getFormOptions', () => {
    test('should return options successfully', async () => {
      const mockOptions = { states: [], skills: [] };
      profileService.getFormOptions.mockResolvedValue(mockOptions);

      await profileController.getFormOptions(mockRequest, mockResponse);

      expect(profileService.getFormOptions).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOptions);
    });

    test('should handle errors', async () => {
      profileService.getFormOptions.mockRejectedValue(new Error('Test error'));

      await profileController.getFormOptions(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('finalizeRegistration', () => {
    test('should create profile and finalize registration successfully', async () => {
      const mockProfileData = { fullName: 'Test User', skills: ['Skill 1'] };
      mockRequest.body = { token: 'testToken', ...mockProfileData };
      const mockResult = { status: 201, message: 'Registration finalized' };
      profileService.finalizeRegistration.mockResolvedValue(mockResult);

      await profileController.finalizeRegistration(mockRequest, mockResponse);

      expect(profileService.finalizeRegistration).toHaveBeenCalledWith('testToken', mockProfileData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    test('should handle errors', async () => {
      mockRequest.body = { token: 'testToken', fullName: 'Test User' };
      profileService.finalizeRegistration.mockRejectedValue(new Error('Test error'));

      await profileController.finalizeRegistration(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Internal server error', 
        error: 'Test error' 
      });
    });
  });

  describe('updateProfile', () => {
    test('should update profile successfully', async () => {
      mockRequest.userId = 1;
      mockRequest.body = { fullName: 'Updated User' };
      const mockResult = { status: 200, message: 'Profile updated successfully' };
      profileService.updateProfile.mockResolvedValue(mockResult);

      await profileController.updateProfile(mockRequest, mockResponse);

      expect(profileService.updateProfile).toHaveBeenCalledWith(1, { fullName: 'Updated User' });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    test('should handle errors', async () => {
      mockRequest.userId = 1;
      mockRequest.body = { fullName: 'Updated User' };
      profileService.updateProfile.mockRejectedValue(new Error('Test error'));

      await profileController.updateProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getProfile', () => {
    test('should return user profile successfully', async () => {
      const mockProfile = { id: 1, name: 'Test User' };
      mockRequest.userId = 1;
      profileService.getProfile.mockResolvedValue(mockProfile);

      await profileController.getProfile(mockRequest, mockResponse);

      expect(profileService.getProfile).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProfile);
    });

    test('should return 404 if profile not found', async () => {
      mockRequest.userId = 1;
      profileService.getProfile.mockResolvedValue(null);

      await profileController.getProfile(mockRequest, mockResponse);

      expect(profileService.getProfile).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Profile not found' });
    });

    test('should handle errors', async () => {
      mockRequest.userId = 1;
      profileService.getProfile.mockRejectedValue(new Error('Test error'));

      await profileController.getProfile(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});