const { validateEventInput } = require('../../middleware/eventMiddleware');

describe('Event Middleware', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  test('should pass validation with valid input', () => {
    mockRequest.body = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1', 'Skill 2'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('should return error for missing eventName', () => {
    mockRequest.body = {
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        eventName: 'Event Name is required'
      })
    });
  });

  test('should return error for eventName longer than 100 characters', () => {
    mockRequest.body = {
      eventName: 'a'.repeat(101),
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        eventName: 'Event Name must be 100 characters or less'
      })
    });
  });

  test('should return error for invalid urgency level', () => {
    mockRequest.body = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Invalid',
      eventDate: '2024-10-15',
      startTime: '09:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        urgency: 'Valid urgency level is required'
      })
    });
  });

  test('should return error for invalid date format', () => {
    mockRequest.body = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Medium',
      eventDate: '2024/10/15',
      startTime: '09:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        eventDate: 'Valid event date is required'
      })
    });
  });

  test('should return error for invalid time format', () => {
    mockRequest.body = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '9:00',
      endTime: '14:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        startTime: 'Valid start time is required'
      })
    });
  });

  test('should return error when end time is before start time', () => {
    mockRequest.body = {
      eventName: 'Test Event',
      eventDescription: 'This is a test event',
      location: 'Test Location',
      requiredSkills: ['Skill 1'],
      urgency: 'Medium',
      eventDate: '2024-10-15',
      startTime: '14:00',
      endTime: '09:00'
    };

    validateEventInput(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: expect.objectContaining({
        endTime: 'End time must be after start time'
      })
    });
  });
});