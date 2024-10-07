const eventController = require('../../controllers/eventController');
const eventService = require('../../services/eventService');

jest.mock('../../services/eventService');

describe('Event Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createEvent', () => {
    test('should create a new event and return 201 status', async () => {
      const mockEvent = { id: 1, eventName: 'Test Event' };
      eventService.createEvent.mockResolvedValue({ message: "Event created successfully", event: mockEvent });

      mockRequest.body = { eventName: 'Test Event' };

      await eventController.createEvent(mockRequest, mockResponse);

      expect(eventService.createEvent).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Event created successfully", event: mockEvent });
    });

    test('should handle validation errors', async () => {
      const error = { name: 'ValidationError', errors: { eventName: 'Event name is required' } };
      eventService.createEvent.mockRejectedValue(error);

      await eventController.createEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ errors: error.errors });
    });
  });

  describe('getAllEvents', () => {
    test('should return all events', async () => {
      const mockEvents = [{ id: 1, eventName: 'Event 1' }, { id: 2, eventName: 'Event 2' }];
      eventService.getAllEvents.mockResolvedValue(mockEvents);

      await eventController.getAllEvents(mockRequest, mockResponse);

      expect(eventService.getAllEvents).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    test('should handle errors when fetching events', async () => {
      eventService.getAllEvents.mockRejectedValue(new Error('Database error'));

      await eventController.getAllEvents(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getEventById', () => {
    test('should return a specific event', async () => {
      const mockEvent = { id: 1, eventName: 'Test Event' };
      eventService.getEventById.mockResolvedValue(mockEvent);

      mockRequest.params.id = '1';

      await eventController.getEventById(mockRequest, mockResponse);

      expect(eventService.getEventById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    test('should return 404 for non-existent event', async () => {
      eventService.getEventById.mockResolvedValue(null);

      mockRequest.params.id = '999';

      await eventController.getEventById(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });
  });

  describe('updateEvent', () => {
    test('should update an event and return 200 status', async () => {
      const mockUpdatedEvent = { id: 1, eventName: 'Updated Event' };
      eventService.updateEvent.mockResolvedValue({ message: "Event updated successfully", event: mockUpdatedEvent });

      mockRequest.params.id = '1';
      mockRequest.body = { eventName: 'Updated Event' };

      await eventController.updateEvent(mockRequest, mockResponse);

      expect(eventService.updateEvent).toHaveBeenCalledWith('1', mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Event updated successfully", event: mockUpdatedEvent });
    });

    test('should return 404 for updating non-existent event', async () => {
      eventService.updateEvent.mockRejectedValue({ status: 404, message: 'Event not found' });

      mockRequest.params.id = '999';

      await eventController.updateEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });
  });

  describe('deleteEvent', () => {
    test('should delete an event and return 200 status', async () => {
      eventService.deleteEvent.mockResolvedValue({ message: "Event deleted successfully" });

      mockRequest.params.id = '1';

      await eventController.deleteEvent(mockRequest, mockResponse);

      expect(eventService.deleteEvent).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Event deleted successfully" });
    });

    test('should return 404 for deleting non-existent event', async () => {
      eventService.deleteEvent.mockRejectedValue({ status: 404, message: 'Event not found' });

      mockRequest.params.id = '999';

      await eventController.deleteEvent(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });
  });

  describe('getFormOptions', () => {
    test('should return form options', async () => {
      const mockOptions = {
        skillOptions: ['Skill 1', 'Skill 2'],
        urgencyOptions: ['Low', 'Medium', 'High']
      };
      eventService.getFormOptions.mockResolvedValue(mockOptions);

      await eventController.getFormOptions(mockRequest, mockResponse);

      expect(eventService.getFormOptions).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOptions);
    });
  });
});