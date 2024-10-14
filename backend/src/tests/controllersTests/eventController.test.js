const eventController = require('../../controllers/eventController');
const eventService = require('../../services/eventService');

jest.mock('../../services/eventService');

describe('Event Controller', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('createEvent should return 201 status on success', async () => {
    const mockEvent = { id: 1, eventName: 'Test Event' };
    eventService.createEvent.mockResolvedValue({ message: 'Event created successfully', event: mockEvent });

    await eventController.createEvent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event created successfully', event: mockEvent });
  });

  test('getAllEvents should return 200 status with events', async () => {
    const mockEvents = [{ id: 1, eventName: 'Event 1' }, { id: 2, eventName: 'Event 2' }];
    eventService.getAllEvents.mockResolvedValue(mockEvents);

    await eventController.getAllEvents(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
  });

  test('getEventById should return 200 status with event', async () => {
    const mockEvent = { id: 1, eventName: 'Test Event' };
    mockRequest.params.id = '1';
    eventService.getEventById.mockResolvedValue(mockEvent);

    await eventController.getEventById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
  });

  test('updateEvent should return 200 status on success', async () => {
    const mockEvent = { id: 1, eventName: 'Updated Event' };
    mockRequest.params.id = '1';
    mockRequest.body = { eventName: 'Updated Event' };
    eventService.updateEvent.mockResolvedValue({ message: 'Event updated successfully', event: mockEvent });

    await eventController.updateEvent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event updated successfully', event: mockEvent });
  });

  test('deleteEvent should return 200 status on success', async () => {
    mockRequest.params.id = '1';
    eventService.deleteEvent.mockResolvedValue({ message: 'Event deleted successfully' });

    await eventController.deleteEvent(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
  });
  test('createEvent should handle service errors', async () => {
    eventService.createEvent.mockRejectedValue(new Error('Service error'));
    await eventController.createEvent(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Internal server error'
    }));
  });

  test('getAllEvents should handle empty event list', async () => {
    eventService.getAllEvents.mockResolvedValue([]);
    await eventController.getAllEvents(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([]);
  });

  test('getEventById should handle non-existent event', async () => {
    mockRequest.params.id = '999';
    eventService.getEventById.mockRejectedValue({ status: 404, message: 'Event not found' });
    await eventController.getEventById(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });

  test('updateEvent should handle invalid input', async () => {
    mockRequest.params.id = '1';
    mockRequest.body = { eventName: '' };
    eventService.updateEvent.mockRejectedValue({ status: 400, errors: { eventName: 'Event Name is required' } });
    await eventController.updateEvent(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      errors: expect.objectContaining({ eventName: 'Event Name is required' })
    }));
  });

  test('deleteEvent should handle non-existent event', async () => {
    mockRequest.params.id = '999';
    eventService.deleteEvent.mockRejectedValue({ status: 404, message: 'Event not found' });
    await eventController.deleteEvent(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
  });
});