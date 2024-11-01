// const eventService = require('../../services/eventService');
// const authService = require('../../services/authService');
// const volunteerHistoryService = require('../../services/historyService');
// const notificationService = require('../../services/notificationService');

// jest.mock('../../services/authService');
// jest.mock('../../services/historyService');
// jest.mock('../../services/notificationService');

// describe('Event Service', () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();

// 		authService.getAllVolunteers.mockReturnValue([
// 			{ id: '1', email: 'volunteer1@test.com' },
// 			{ id: '2', email: 'volunteer2@test.com' }
// 		]);
// 	});

// 	describe('createEvent', () => {
// 		const validEventData = {
// 			eventName: 'Test Event',
// 			eventDescription: 'Test Description',
// 			address1: '123 Test St',
// 			city: 'Test City',
// 			state: 'CA',
// 			zipCode: '12345',
// 			requiredSkills: ['Animal Care'],
// 			urgency: 'Medium',
// 			eventDate: '2024-12-25',
// 			startTime: '09:00',
// 			endTime: '17:00'
// 		};

// 		it('should create a new event and notification successfully', () => {
// 			const mockNotification = {
// 				id: 1,
// 				type: 'New Event',
// 				message: expect.stringContaining('Test Event')
// 			};
// 			notificationService.createEventNotification.mockReturnValue(mockNotification);

// 			const result = eventService.createEvent(validEventData);

// 			expect(result.message).toBe('Event created successfully');
// 			expect(result.event).toMatchObject({
// 				...validEventData,
// 				id: expect.any(String)
// 			});
// 			expect(volunteerHistoryService.updateHistoryRecord).toHaveBeenCalled();
// 			expect(notificationService.createEventNotification).toHaveBeenCalledWith(
// 				expect.objectContaining({
// 					eventName: validEventData.eventName,
// 					eventDate: validEventData.eventDate
// 				})
// 			);
// 		});

// 		it('should create a new event successfully', () => {
// 			const result = eventService.createEvent(validEventData);

// 			expect(result.message).toBe('Event created successfully');
// 			expect(result.event).toMatchObject({
// 				...validEventData,
// 				id: expect.any(String)
// 			});
// 			expect(volunteerHistoryService.updateHistoryRecord).toHaveBeenCalled();
// 		});

// 		it('should throw an error if required fields are missing', () => {
// 			const invalidEventData = { ...validEventData, eventName: '' };

// 			expect(() => {
// 				eventService.createEvent(invalidEventData);
// 			}).toThrow();
// 		});

// 		it('should create history records for all volunteers', () => {
// 			eventService.createEvent(validEventData);
// 			expect(volunteerHistoryService.updateHistoryRecord).toHaveBeenCalledTimes(2);
// 		});
// 	});

// 	describe('getEventById', () => {
// 		it('should return an event when it exists', () => {
// 			const event = eventService.getEventById('1');
// 			expect(event).toBeTruthy();
// 			expect(event.id).toBe('1');
// 		});

// 		it('should throw an error when event does not exist', () => {
// 			expect(() => {
// 				eventService.getEventById('999');
// 			}).toThrow('Event not found');
// 		});
// 	});

// 	describe('getAllEvents', () => {
// 		it('should return all events', () => {
// 			const events = eventService.getAllEvents();
// 			expect(Array.isArray(events)).toBe(true);
// 			expect(events.length).toBeGreaterThan(0);
// 		});
// 	});

// 	describe('updateEvent', () => {
// 		const updateData = {
// 			eventName: 'Updated Event',
// 			eventDescription: 'Updated Description',
// 			address1: '123 Test St',
// 			city: 'Test City',
// 			state: 'CA',
// 			zipCode: '12345',
// 			requiredSkills: ['Animal Care'],
// 			urgency: 'High',
// 			eventDate: '2024-12-25',
// 			startTime: '10:00',
// 			endTime: '18:00'
// 		};

// 		it('should update an existing event', () => {
// 			const result = eventService.updateEvent('1', updateData);
// 			expect(result.message).toBe('Event updated successfully');
// 			expect(result.event).toMatchObject(updateData);
// 		});

// 		it('should throw an error when updating non-existent event', () => {
// 			expect(() => {
// 				eventService.updateEvent('999', updateData);
// 			}).toThrow('Event not found');
// 		});
// 	});

// 	describe('deleteEvent', () => {
// 		it('should delete an existing event', () => {
// 			const result = eventService.deleteEvent('1');
// 			expect(result.message).toBe('Event deleted successfully');
// 		});

// 		it('should throw an error when deleting non-existent event', () => {
// 			expect(() => {
// 				eventService.deleteEvent('999');
// 			}).toThrow('Event not found');
// 		});
// 	});

// 	describe('getFormOptions', () => {
// 		it('should return valid form options', () => {
// 			const options = eventService.getFormOptions();

// 			expect(options).toHaveProperty('skillOptions');
// 			expect(options).toHaveProperty('urgencyOptions');
// 			expect(options).toHaveProperty('stateOptions');

// 			expect(Array.isArray(options.skillOptions)).toBe(true);
// 			expect(Array.isArray(options.urgencyOptions)).toBe(true);
// 			expect(Array.isArray(options.stateOptions)).toBe(true);

// 			expect(options.urgencyOptions).toContain('Low');
// 			expect(options.urgencyOptions).toContain('Medium');
// 			expect(options.urgencyOptions).toContain('High');
// 			expect(options.urgencyOptions).toContain('Critical');
// 		});
// 	});
// });
// eventService.test.js
const { Event, State, User, Op } = require('../../../models');
const eventService = require('../../services/eventService');

jest.mock('../../../models', () => ({
  Event: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  State: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  User: {},
  Op: {
    overlap: jest.fn(),
    between: jest.fn(),
  },
}));

describe('Event Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllEvents', () => {
    it('should fetch all events successfully', async () => {
      const mockEvents = [{ id: 1, eventName: 'Event 1' }];
      Event.findAll.mockResolvedValueOnce(mockEvents);

      const result = await eventService.getAllEvents();

      expect(result).toEqual(mockEvents);
      expect(Event.findAll).toHaveBeenCalledWith({
        include: expect.any(Array),
        order: [['eventDate', 'ASC']],
      });
    });

    it('should handle errors when fetching events', async () => {
      Event.findAll.mockRejectedValueOnce(new Error('Database error'));

      await expect(eventService.getAllEvents()).rejects.toMatchObject({
        status: 500,
        message: 'Error fetching events',
      });
    });
  });

  describe('createEvent', () => {
    const eventData = {
      eventName: 'New Event',
      requiredSkills: ['Animal Care'],
      state: 'CA',
    };
    const userId = 1;
  
    it('should create an event successfully', async () => {
      // Ensure state validation and event creation
      State.findOne.mockResolvedValueOnce({ code: 'CA' });
      Event.create.mockResolvedValueOnce({ id: 1 });
      Event.findByPk.mockResolvedValueOnce({ id: 1, ...eventData, createdBy: userId });
  
      const result = await eventService.createEvent(eventData, userId);
  
      expect(result).toHaveProperty('message', 'Event created successfully');
      expect(result).toHaveProperty('event');
    });
  
    it('should throw an error for invalid skills', async () => {
      const invalidData = { ...eventData, requiredSkills: ['Invalid Skill'] };
      
      await expect(eventService.createEvent(invalidData, userId)).rejects.toMatchObject({
        status: 400,
        message: 'Invalid skills provided',
        invalidSkills: ['Invalid Skill']
      });
    });
  
    it('should throw an error for an invalid state code', async () => {
      State.findOne.mockResolvedValueOnce(null); // Simulate invalid state
  
      await expect(eventService.createEvent(eventData, userId)).rejects.toMatchObject({
        status: 400,
        message: 'Invalid state code provided'
      });
    });
  });
  
  
  describe('deleteEvent', () => {
    const eventId = 1;
    const userId = 1;

    it('should delete an event successfully', async () => {
      const mockEvent = { id: eventId, createdBy: userId, destroy: jest.fn() };
      Event.findByPk.mockResolvedValueOnce(mockEvent);

      const result = await eventService.deleteEvent(eventId, userId);

      expect(result).toEqual({ message: 'Event deleted successfully' });
      expect(mockEvent.destroy).toHaveBeenCalled();
    });

    it('should throw an error for unauthorized user deletion attempt', async () => {
      const mockEvent = { id: eventId, createdBy: 2 };
      Event.findByPk.mockResolvedValueOnce(mockEvent);

      await expect(eventService.deleteEvent(eventId, userId)).rejects.toMatchObject({
        status: 403,
        message: 'Unauthorized to delete this event',
      });
    });
  });

  describe('updateEvent', () => {
    const mockEventData = {
      eventName: 'Updated Event',
      requiredSkills: ['Animal Care'],
      state: 'NY',
    };
    const eventId = 1;
    const userId = 1;
  
    it('should update an event successfully', async () => {
      // Create a mock event with the required methods
      const mockEvent = {
        id: eventId,
        createdBy: userId,
        update: jest.fn().mockResolvedValue(true)
      };
      
      // Mock the findByPk to return our mock event
      Event.findByPk.mockResolvedValue(mockEvent);
      
      // Mock state validation
      State.findOne.mockResolvedValue({ code: 'NY' });
      
      // Mock getEventById to return updated event
      const mockUpdatedEvent = { ...mockEvent, ...mockEventData };
      Event.findByPk.mockResolvedValueOnce(mockUpdatedEvent);
  
      const result = await eventService.updateEvent(eventId, mockEventData, userId);
  
      expect(result).toHaveProperty('message', 'Event updated successfully');
      expect(result).toHaveProperty('event');
      expect(mockEvent.update).toHaveBeenCalledWith(mockEventData);
    });
  });
  
  describe('searchEvents', () => {
    it('should search events based on criteria', async () => {
      const mockCriteria = {
        state: 'CA',
        urgency: 'High',
        skills: ['Animal Care'],
      };
      const mockEvents = [{ id: 1, eventName: 'Event 1' }];
  
      // Mock the database query
      Event.findAll.mockResolvedValue(mockEvents);
  
      const result = await eventService.searchEvents(mockCriteria);
  
      expect(result).toEqual(mockEvents);
      expect(Event.findAll).toHaveBeenCalledWith({
        where: expect.any(Object),
        include: expect.any(Array),
        order: [['eventDate', 'ASC']]
      });
    });
  
    it('should handle database errors in searchEvents', async () => {
      // Ensure the mock rejection is properly set up
      Event.findAll.mockRejectedValue(new Error('Database error'));
  
      // Use try-catch to properly test the error
      try {
        await eventService.searchEvents({});
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toMatchObject({
          status: 500,
          message: 'Error searching events'
        });
      }
    });
  });
  describe('getFormOptions', () => {
    it('should fetch form options successfully', async () => {
      const mockStates = [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' }
      ];
      State.findAll.mockResolvedValueOnce(mockStates);
  
      const result = await eventService.getFormOptions();
  
      expect(result).toHaveProperty('states', mockStates);
      expect(result).toHaveProperty('skills');
      expect(result).toHaveProperty('urgencyLevels');
    });
  
    it('should handle errors when fetching form options', async () => {
      State.findAll.mockRejectedValueOnce(new Error('Database error'));
  
      await expect(eventService.getFormOptions()).rejects.toMatchObject({
        status: 500,
        message: 'Error fetching form options'
      });
    });
  });
  
  describe('getEventById', () => {
    it('should fetch an event by id successfully', async () => {
      const mockEvent = { 
        id: 1, 
        eventName: 'Test Event',
        state: { code: 'CA', name: 'California' },
        user: { email: 'test@example.com' }
      };
      Event.findByPk.mockResolvedValueOnce(mockEvent);
  
      const result = await eventService.getEventById(1);
      expect(result).toEqual(mockEvent);
    });
  
    it('should throw error when event not found', async () => {
      Event.findByPk.mockResolvedValueOnce(null);
  
      await expect(eventService.getEventById(999)).rejects.toMatchObject({
        status: 404,
        message: 'Event not found'
      });
    });
  
    it('should handle database errors', async () => {
      Event.findByPk.mockRejectedValueOnce(new Error('Database error'));
  
      await expect(eventService.getEventById(1)).rejects.toThrow('Database error');
    });
  });
  
  describe('createEvent additional cases', () => {
    it('should handle SequelizeValidationError', async () => {
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        path: 'eventName',
        message: 'Event name is required'
      }];
  
      Event.create.mockRejectedValueOnce(validationError);
      State.findOne.mockResolvedValueOnce({ code: 'CA' });
  
      await expect(eventService.createEvent({
        eventName: '',
        requiredSkills: ['Animal Care'],
        state: 'CA'
      }, 1)).rejects.toMatchObject({
        status: 400,
        errors: [{
          field: 'eventName',
          message: 'Event name is required'
        }]
      });
    });
  });
  
  describe('updateEvent additional cases', () => {
    const eventId = 1;
    const userId = 1;
  
    it('should handle validation error on update', async () => {
      const mockEvent = {
        id: eventId,
        createdBy: userId,
        update: jest.fn().mockRejectedValue({
          name: 'SequelizeValidationError',
          errors: [{
            path: 'eventName',
            message: 'Event name cannot be empty'
          }]
        })
      };
      Event.findByPk.mockResolvedValueOnce(mockEvent);
      State.findOne.mockResolvedValueOnce({ code: 'NY' });
  
      await expect(eventService.updateEvent(eventId, {
        eventName: '',
        state: 'NY'
      }, userId)).rejects.toMatchObject({
        status: 400,
        errors: [{
          field: 'eventName',
          message: 'Event name cannot be empty'
        }]
      });
    });
  
    it('should throw error when updating with invalid skills', async () => {
      const mockEvent = {
        id: eventId,
        createdBy: userId
      };
      Event.findByPk.mockResolvedValueOnce(mockEvent);
  
      await expect(eventService.updateEvent(eventId, {
        requiredSkills: ['Invalid Skill']
      }, userId)).rejects.toMatchObject({
        status: 400,
        message: 'Invalid skills provided',
        invalidSkills: ['Invalid Skill']
      });
    });
  
    it('should throw error when updating with invalid state', async () => {
      const mockEvent = {
        id: eventId,
        createdBy: userId
      };
      Event.findByPk.mockResolvedValueOnce(mockEvent);
      State.findOne.mockResolvedValueOnce(null);
  
      await expect(eventService.updateEvent(eventId, {
        state: 'XX'
      }, userId)).rejects.toMatchObject({
        status: 400,
        message: 'Invalid state code provided'
      });
    });
  });
  
  
});
