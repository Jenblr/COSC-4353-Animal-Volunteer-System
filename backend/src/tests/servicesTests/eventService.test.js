const eventService = require('../../services/eventService');
const { State, Event, User } = require('../../../models');
const notificationService = require('../../services/notificationService');
const historyService = require('../../services/historyService');
const { Op } = require('sequelize');

// Mock dependencies
jest.mock('../../../models', () => ({
  State: {
    findOne: jest.fn(),
    findAll: jest.fn(),
  },
  Event: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  User: {
    findAll: jest.fn(),
  },
}));

jest.mock('../../services/notificationService', () => ({
  createEventNotification: jest.fn(),
}));

jest.mock('../../services/historyService', () => ({
  initializeEventHistory: jest.fn(),
}));

describe('eventService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFormOptions', () => {
    it('should return form options with states, skills, and urgency levels', async () => {
      const mockStates = [
        { code: 'CA', name: 'California' },
        { code: 'TX', name: 'Texas' },
      ];
      State.findAll.mockResolvedValue(mockStates);

      const result = await eventService.getFormOptions();

      expect(State.findAll).toHaveBeenCalledWith({
        attributes: ['code', 'name'],
        order: [['name', 'ASC']],
      });
      expect(result).toEqual({
        states: mockStates,
        skills: expect.any(Array),
        urgencyLevels: ['Low', 'Medium', 'High', 'Critical'],
      });
    });

    it('should throw an error if fetching states fails', async () => {
      State.findAll.mockRejectedValue(new Error('Database error'));

      await expect(eventService.getFormOptions()).rejects.toEqual({
        status: 500,
        message: 'Error fetching form options',
        error: 'Database error',
      });
    });
  });

  describe('getAllEvents', () => {
    it('should return all events with associated states and users', async () => {
      const mockEvents = [
        {
          id: 1,
          eventName: 'Test Event',
          State: { code: 'CA', name: 'California' },
          User: { email: 'test@example.com' },
        },
      ];
      Event.findAll.mockResolvedValue(mockEvents);

      const result = await eventService.getAllEvents();

      expect(Event.findAll).toHaveBeenCalledWith({
        include: [
          { model: State, attributes: ['code', 'name'] },
          { model: User, attributes: ['email'] },
        ],
        order: [['eventDate', 'ASC']],
      });
      expect(result).toEqual(mockEvents);
    });

    it('should throw an error if fetching events fails', async () => {
      Event.findAll.mockRejectedValue(new Error('Database error'));

      await expect(eventService.getAllEvents()).rejects.toEqual({
        status: 500,
        message: 'Error fetching events',
        error: 'Database error',
      });
    });
  });

  describe('createEvent', () => {
    it('should throw an error if event data is missing required fields', async () => {
        const eventData = { state: 'CA', requiredSkills: ['Animal Care'] }; // Missing eventName
        State.findOne.mockResolvedValue({ code: 'CA', name: 'California' });
        Event.create.mockRejectedValue({
          name: 'SequelizeValidationError',
          errors: [{ path: 'eventName', message: 'Event.eventName cannot be null' }],
        });
      
        await expect(eventService.createEvent(eventData, 1)).rejects.toEqual({
          status: 400,
          errors: [{ field: 'eventName', message: 'Event.eventName cannot be null' }],
        });
      });

    it('should throw an error for invalid skills', async () => {
      const eventData = {
        eventName: 'Test Event',
        state: 'CA',
        requiredSkills: ['Invalid Skill'],
      };

      await expect(eventService.createEvent(eventData, 1)).rejects.toEqual({
        status: 400,
        message: 'Invalid skills provided',
        invalidSkills: ['Invalid Skill'],
      });
    });

    it('should throw an error when an invalid state code is provided', async () => {
      const eventData = {
        eventName: 'Test Event',
        state: 'InvalidState',
        requiredSkills: ['Animal Care'],
      };

      State.findOne.mockResolvedValue(null);

      await expect(eventService.createEvent(eventData, 1)).rejects.toEqual({
        status: 400,
        message: 'Invalid state code provided',
      });

      expect(State.findOne).toHaveBeenCalledWith({ where: { code: 'InvalidState' } });
    });

    it('should successfully create an event with valid data', async () => {
      const eventData = {
        eventName: 'Test Event',
        state: 'CA',
        requiredSkills: ['Animal Care'],
      };

      const createdEvent = { id: 1, eventName: 'Test Event' };

      State.findOne.mockResolvedValue({ code: 'CA', name: 'California' });
      Event.create.mockResolvedValue(createdEvent);
      notificationService.createEventNotification.mockResolvedValue();
      historyService.initializeEventHistory.mockResolvedValue();
      eventService.getEventById = jest.fn().mockResolvedValue(createdEvent);

      const result = await eventService.createEvent(eventData, 1);

      expect(Event.create).toHaveBeenCalledWith({
        ...eventData,
        createdBy: 1,
      });
      expect(notificationService.createEventNotification).toHaveBeenCalledWith({
        eventName: 'Test Event',
        eventDate: undefined,
      });
      expect(historyService.initializeEventHistory).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        message: 'Event created successfully',
        event: createdEvent,
      });
    });

    it('should handle Sequelize validation errors', async () => {
      const eventData = {
        eventName: '',
        state: 'CA',
        requiredSkills: ['Animal Care'],
      };
      const validationError = {
        name: 'SequelizeValidationError',
        errors: [{ path: 'eventName', message: 'Event name is required' }],
      };

      State.findOne.mockResolvedValue({ code: 'CA', name: 'California' });
      Event.create.mockRejectedValue(validationError);

      await expect(eventService.createEvent(eventData, 1)).rejects.toEqual({
        status: 400,
        errors: [{ field: 'eventName', message: 'Event name is required' }],
      });
    });

    it('should throw an error if notificationService fails', async () => {
      const eventData = {
        eventName: 'Test Event',
        state: 'CA',
        requiredSkills: ['Animal Care'],
      };

      State.findOne.mockResolvedValue({ code: 'CA', name: 'California' });
      Event.create.mockResolvedValue({ id: 1, eventName: 'Test Event' });
      notificationService.createEventNotification.mockImplementation(() => {
        throw new Error('Notification failed');
      });

      await expect(eventService.createEvent(eventData, 1)).rejects.toThrow('Notification failed');
      expect(historyService.initializeEventHistory).not.toHaveBeenCalled();
    });

    it('should throw an error if historyService fails', async () => {
      const eventData = {
        eventName: 'Test Event',
        state: 'CA',
        requiredSkills: ['Animal Care'],
      };

      State.findOne.mockResolvedValue({ code: 'CA', name: 'California' });
      Event.create.mockResolvedValue({ id: 1, eventName: 'Test Event' });
      notificationService.createEventNotification.mockResolvedValue();
      historyService.initializeEventHistory.mockImplementation(() => {
        throw new Error('History initialization failed');
      });

      await expect(eventService.createEvent(eventData, 1)).rejects.toThrow('History initialization failed');
    });
  });

  describe('getEventById', () => {
    it('should return event details when event exists', async () => {
        const mockEvent = { id: 1, eventName: 'Test Event' };
      
        Event.findByPk.mockResolvedValue(mockEvent);
      
        const result = await eventService.getEventById(1);
      
        expect(Event.findByPk).toHaveBeenCalledWith(1, {
          include: [
            { model: State, attributes: ['code', 'name'] },
            { model: User, attributes: ['email'] },
          ],
        });
        expect(result).toEqual(mockEvent);
      });
      
      
      

    it('should throw an error if the event does not exist', async () => {
        Event.findByPk.mockResolvedValue(null);
      
        await expect(eventService.getEventById(999)).rejects.toEqual({
          status: 404,
          message: 'Event not found',
        });
    });
      
  });

  describe('searchEvents', () => {
    it('should throw an error for no search criteria', async () => {
      await expect(eventService.searchEvents({})).rejects.toEqual({
        status: 400,
        message: 'No search criteria provided',
      });
    });

    it('should throw an error for invalid start date format in searchEvents', async () => {
      const criteria = { startDate: 'invalid-date' };

      await expect(eventService.searchEvents(criteria)).rejects.toEqual({
        status: 400,
        message: 'Invalid start date format',
      });
    });

    it('should throw an error for invalid end date format in searchEvents', async () => {
      const criteria = { endDate: 'invalid-date' };

      await expect(eventService.searchEvents(criteria)).rejects.toEqual({
        status: 400,
        message: 'Invalid end date format',
      });
    });

    it('should throw an error when start date is after end date in searchEvents', async () => {
      const criteria = { startDate: '2024-12-31', endDate: '2024-01-01' };

      await expect(eventService.searchEvents(criteria)).rejects.toEqual({
        status: 400,
        message: 'Start date must be before end date',
      });
    });

    it('should return events filtered by state in searchEvents', async () => {
      const criteria = { state: 'CA' };

      const mockEvents = [
        { id: 1, eventName: 'Event 1', state: 'CA' },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const result = await eventService.searchEvents(criteria);

      expect(Event.findAll).toHaveBeenCalledWith({
        where: { state: 'CA' },
        include: [
          { model: State, attributes: ['code', 'name'] },
          { model: User, attributes: ['email'] },
        ],
        order: [['eventDate', 'ASC']],
      });

      expect(result).toEqual(mockEvents);
    });

    it('should filter events by requiredSkills in searchEvents', async () => {
      const criteria = { requiredSkills: ['Animal Care'] };

      const mockEvents = [
        {
          id: 1,
          eventName: 'Event 1',
          requiredSkills: ['Animal Care', 'Feeding'],
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const result = await eventService.searchEvents(criteria);

      expect(Event.findAll).toHaveBeenCalledWith({
        where: { requiredSkills: { [Op.overlap]: ['Animal Care'] } },
        include: [
          { model: State, attributes: ['code', 'name'] },
          { model: User, attributes: ['email'] },
        ],
        order: [['eventDate', 'ASC']],
      });

      expect(result).toEqual(mockEvents);
    });

    it('should filter events by urgency in searchEvents', async () => {
      const criteria = { urgency: 'High' };

      const mockEvents = [
        {
          id: 1,
          eventName: 'Event 1',
          urgency: 'High',
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const result = await eventService.searchEvents(criteria);

      expect(Event.findAll).toHaveBeenCalledWith({
        where: { urgency: 'High' },
        include: [
          { model: State, attributes: ['code', 'name'] },
          { model: User, attributes: ['email'] },
        ],
        order: [['eventDate', 'ASC']],
      });

      expect(result).toEqual(mockEvents);
    });

    it('should filter events by valid start and end dates', async () => {
      const criteria = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockEvents = [
        { id: 1, eventName: 'Event 1', eventDate: '2024-05-01' },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const result = await eventService.searchEvents(criteria);

      expect(Event.findAll).toHaveBeenCalledWith({
        where: {
          eventDate: {
            [Op.gte]: new Date('2024-01-01'),
            [Op.lte]: new Date('2024-12-31'),
          },
        },
        include: [
          { model: State, attributes: ['code', 'name'] },
          { model: User, attributes: ['email'] },
        ],
        order: [['eventDate', 'ASC']],
      });

      expect(result).toEqual(mockEvents);
    });

    it('should handle error thrown inside searchEvents', async () => {
      const criteria = { state: 'CA' };
      Event.findAll.mockRejectedValue(new Error('Database error'));

      await expect(eventService.searchEvents(criteria)).rejects.toEqual({
        status: 500,
        message: 'Error searching events',
        error: 'Database error',
      });
    });
  });
});




