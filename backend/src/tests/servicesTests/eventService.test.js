
const eventService = require('../../services/eventService');

describe('Event Service', () => {
  const mockEvent = {
    eventName: 'Test Event',
    eventDescription: 'This is a test event',
    location: 'Test Location',
    requiredSkills: ['Skill 1', 'Skill 2'],
    urgency: 'Medium',
    eventDate: '2024-10-15',
    startTime: '09:00',
    endTime: '14:00'
  };

  test('createEvent should create and return a new event', () => {
    const result = eventService.createEvent(mockEvent);

    expect(result).toHaveProperty('message', 'Event created successfully');
    expect(result).toHaveProperty('event');
    expect(result.event).toMatchObject(mockEvent);
    expect(result.event).toHaveProperty('id');
    expect(result.event).toHaveProperty('createdAt');
  });

  test('getAllEvents should return all events', () => {
    const events = eventService.getAllEvents();

    expect(Array.isArray(events)).toBe(true);
    expect(events.length).toBeGreaterThan(0);
  });

  test('getEventById should return a specific event', () => {
    const createdEvent = eventService.createEvent(mockEvent).event;
    const retrievedEvent = eventService.getEventById(createdEvent.id);

    expect(retrievedEvent).toMatchObject(createdEvent);
  });

  test('updateEvent should update and return the event', () => {
    const createdEvent = eventService.createEvent(mockEvent).event;
    const updatedEventData = { ...mockEvent, eventName: 'Updated Event Name' };

    const result = eventService.updateEvent(createdEvent.id, updatedEventData);

    expect(result).toHaveProperty('message', 'Event updated successfully');
    expect(result).toHaveProperty('event');
    expect(result.event).toMatchObject(updatedEventData);
    expect(result.event).toHaveProperty('updatedAt');
  });

  test('deleteEvent should delete the event and return success message', () => {
    const createdEvent = eventService.createEvent(mockEvent).event;
    const result = eventService.deleteEvent(createdEvent.id);

    expect(result).toHaveProperty('message', 'Event deleted successfully');

    expect(() => eventService.getEventById(createdEvent.id)).toThrow();
  });

  test('getFormOptions should return valid options', () => {
    const options = eventService.getFormOptions();

    expect(options).toHaveProperty('skillOptions');
    expect(options).toHaveProperty('urgencyOptions');
    expect(Array.isArray(options.skillOptions)).toBe(true);
    expect(Array.isArray(options.urgencyOptions)).toBe(true);
  });
});