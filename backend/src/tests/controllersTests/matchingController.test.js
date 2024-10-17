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

  //tests for getMatchingVolunteers
  describe('getMatchingVolunteers', () => {
    it('should return matching volunteers with status 200', async () => {
      const mockVolunteers = [{ userId: '1', fullName: 'John Doe' }];
      volunteerMatchingService.getMatchingVolunteers.mockResolvedValue(mockVolunteers);

      mockRequest.params = { eventId: '123' };

      await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockVolunteers);
    });

    it('should return 404 when no matching volunteers are found', async () => {
      volunteerMatchingService.getMatchingVolunteers.mockResolvedValue({ message: 'No matching volunteers found for this event.' });

      mockRequest.params = { eventId: '123' };

      await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'No matching volunteers found for this event.' });
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

  // tests for matchVolunteerToEvent
  describe('matchVolunteerToEvent', () => {
    it('should match volunteers to event and return 200 status', async () => {
      const mockResult = [
        { volunteerId: '1', message: 'Volunteer John Doe successfully matched to event Animal Shelter Cleanup' },
        { volunteerId: '2', message: 'Volunteer Jane Smith successfully matched to event Animal Shelter Cleanup' }
      ];
      volunteerMatchingService.matchVolunteerToEvent.mockResolvedValue(mockResult);

      mockRequest.body = { eventId: '123', volunteerIds: ['1', '2'] };

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle 400 errors from service for missing or invalid event/volunteer IDs', async () => {
      const mockError = { status: 400, message: 'Event ID or volunteer IDs are missing or invalid' };
      volunteerMatchingService.matchVolunteerToEvent.mockRejectedValue(mockError);

      mockRequest.body = { eventId: '', volunteerIds: [] };  //invalid input

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event ID or volunteer IDs are missing or invalid' });
    });

    it('should handle other errors and return 500 status', async () => {
      volunteerMatchingService.matchVolunteerToEvent.mockRejectedValue(new Error('Database error'));

      mockRequest.body = { eventId: '123', volunteerIds: ['1', '2'] };

      await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Internal server error',
        error: 'Database error'
      }));
    });
  });
});



