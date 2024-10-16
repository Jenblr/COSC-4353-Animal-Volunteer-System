const eventService = require('../../services/eventService');

let originalEvents;

beforeEach(() => {
  // store the original events to restore later
  originalEvents = [...eventService.getAllEvents()];
  
  //reset the events array to its initial state before each test
  eventService.getAllEvents().length = 0;
  eventService.getAllEvents().push(...originalEvents);
});

describe('Event Service', () => {
  test('createEvent should add a new event', () => {
    const newEvent = {
      eventName: 'New Test Event',
      eventDescription: 'Test Description',
      address1: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zipCode: '12345',
      requiredSkills: ['Cleaning'],
      urgency: 'Medium',
      eventDate: '2024-12-01',
      startTime: '09:00',
      endTime: '12:00'
    };

    const result = eventService.createEvent(newEvent);

    expect(result.event).toHaveProperty('id');
    expect(result.event.eventName).toBe('New Test Event');
    expect(result.message).toBe('Event created successfully');
  });

  test('getAllEvents should return all events', () => {
    const events = eventService.getAllEvents();
    expect(Array.isArray(events)).toBeTruthy();
    expect(events.length).toBeGreaterThan(0);
  });

  test('getEventById should return the correct event', () => {
    const event = eventService.getEventById(1);
    expect(event).toHaveProperty('id', 1);
  });

  test('updateEvent should update an existing event', () => {
    //all required fields in the update data
    const updatedData = {
      eventName: 'Updated Event Name',
      eventDescription: 'Updated Description',
      address1: 'Updated Address',
      city: 'Updated City',
      state: 'TX',
      zipCode: '12345',
      requiredSkills: ['Updated Skill'],
      urgency: 'High',
      eventDate: '2024-12-25',
      startTime: '10:00',
      endTime: '14:00'
    };
  
    const result = eventService.updateEvent(1, updatedData);
  
    expect(result.event.eventName).toBe('Updated Event Name');
    expect(result.event.eventDescription).toBe('Updated Description');
    expect(result.message).toBe('Event updated successfully');
  });
  

  test('deleteEvent should remove an event', () => {
    const result = eventService.deleteEvent(1);
    expect(result.message).toBe('Event deleted successfully');
    expect(() => eventService.getEventById(1)).toThrow('Event not found');
  });

  test('createEvent should throw error for invalid data', () => {
    const invalidEvent = {
      eventName: '',
      eventDescription: 'Test Description',
      address1: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zipCode: '12345',
      requiredSkills: ['Cleaning'],
      urgency: 'Medium',
      eventDate: '2024-12-01',
      startTime: '09:00',
      endTime: '12:00'
    };

    expect(() => eventService.createEvent(invalidEvent)).toThrow();
    expect(() => eventService.createEvent(invalidEvent)).toThrowError(expect.objectContaining({
      status: 400,
      errors: expect.objectContaining({
        eventName: 'Event Name is required'
      })
    }));
  });

  test('getEventById should throw error for non-existent event', () => {
    expect(() => eventService.getEventById(999)).toThrow('Event not found');
  });

  test('updateEvent should throw error for invalid data', () => {
    const invalidUpdate = { eventName: '' };
    expect(() => eventService.updateEvent(1, invalidUpdate)).toThrow();
  });

  test('deleteEvent should throw error for non-existent event', () => {
    expect(() => eventService.deleteEvent(999)).toThrow('Event not found');
  });

  test('getAllEvents should return empty array when no events exist', () => {
    //temporarily clear the events array
    const events = eventService.getAllEvents();
    events.length = 0;

    const result = eventService.getAllEvents();
    expect(result).toEqual([]);
    
    //restore the original events
    events.push(...originalEvents);
  });
});
