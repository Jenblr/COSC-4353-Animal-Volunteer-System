//matchingController.test.js

const matchingController = require('../../controllers/matchingController');
const volunteerMatchingService = require('../../services/matchingService');

jest.mock('../../services/matchingService');

describe('Matching Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getMatchingVolunteers', () => {
    it('should return matching volunteers with status 200', async () => {
      const mockVolunteers = [{ id: '1', name: 'John Doe' }];
      volunteerMatchingService.getMatchingVolunteers.mockResolvedValue(mockVolunteers);

      mockRequest.params = { eventId: '123' };

      await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVolunteers);
    });

    it('should return 404 when no matching volunteers found', async () => {
      volunteerMatchingService.getMatchingVolunteers.mockResolvedValue({ message: 'No matching volunteers found' });

      mockRequest.params = { eventId: '123' };

      await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No matching volunteers found' });
    });

    it('should handle errors and return 500 status', async () => {
      volunteerMatchingService.getMatchingVolunteers.mockRejectedValue(new Error('Database error'));

      mockRequest.params = { eventId: '123' };

      await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Internal server error',
        error: 'Database error'
      }));
    });
  });

  describe('matchVolunteerToEvent', () => {
    it('should match volunteer to event and return 200 status', async () => {
      const mockResult = { message: 'Volunteer successfully matched' };
      volunteerMatchingService.matchVolunteerToEvent.mockResolvedValue(mockResult);

      mockRequest.body = { eventId: '123', volunteerId: '456' };

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle 400 errors from service', async () => {
      const mockError = { status: 400, errors: ['Invalid input'] };
      volunteerMatchingService.matchVolunteerToEvent.mockRejectedValue(mockError);

      mockRequest.body = { eventId: '123', volunteerId: '456' };

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: ['Invalid input'] });
    });

    it('should handle other errors and return 500 status', async () => {
      volunteerMatchingService.matchVolunteerToEvent.mockRejectedValue(new Error('Database error'));

      mockRequest.body = { eventId: '123', volunteerId: '456' };

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Internal server error',
        error: 'Database error'
      }));
    });
  });
});