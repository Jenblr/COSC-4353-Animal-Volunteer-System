const eventService = require('../../services/eventService');
const authService = require('../../services/authService');
const volunteerHistoryService = require('../../services/historyService');

jest.mock('../../services/authService');
jest.mock('../../services/historyService');

describe('Event Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        authService.getAllVolunteers.mockReturnValue([
            { id: '1', email: 'volunteer1@test.com' },
            { id: '2', email: 'volunteer2@test.com' }
        ]);
    });

    describe('createEvent', () => {
        const validEventData = {
            eventName: 'Test Event',
            eventDescription: 'Test Description',
            address1: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zipCode: '12345',
            requiredSkills: ['Animal Care'],
            urgency: 'Medium',
            eventDate: '2024-12-25',
            startTime: '09:00',
            endTime: '17:00'
        };

        it('should create a new event successfully', () => {
            const result = eventService.createEvent(validEventData);

            expect(result.message).toBe('Event created successfully');
            expect(result.event).toMatchObject({
                ...validEventData,
                id: expect.any(String)
            });
            expect(volunteerHistoryService.updateHistoryRecord).toHaveBeenCalled();
        });

        it('should throw an error if required fields are missing', () => {
            const invalidEventData = { ...validEventData, eventName: '' };

            expect(() => {
                eventService.createEvent(invalidEventData);
            }).toThrow();
        });

        it('should create history records for all volunteers', () => {
            eventService.createEvent(validEventData);
            expect(volunteerHistoryService.updateHistoryRecord).toHaveBeenCalledTimes(2);
        });
    });

    describe('getEventById', () => {
        it('should return an event when it exists', () => {
            const event = eventService.getEventById('1');
            expect(event).toBeTruthy();
            expect(event.id).toBe('1');
        });

        it('should throw an error when event does not exist', () => {
            expect(() => {
                eventService.getEventById('999');
            }).toThrow('Event not found');
        });
    });

    describe('getAllEvents', () => {
        it('should return all events', () => {
            const events = eventService.getAllEvents();
            expect(Array.isArray(events)).toBe(true);
            expect(events.length).toBeGreaterThan(0);
        });
    });

    describe('updateEvent', () => {
        const updateData = {
            eventName: 'Updated Event',
            eventDescription: 'Updated Description',
            address1: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zipCode: '12345',
            requiredSkills: ['Animal Care'],
            urgency: 'High',
            eventDate: '2024-12-25',
            startTime: '10:00',
            endTime: '18:00'
        };

        it('should update an existing event', () => {
            const result = eventService.updateEvent('1', updateData);
            expect(result.message).toBe('Event updated successfully');
            expect(result.event).toMatchObject(updateData);
        });

        it('should throw an error when updating non-existent event', () => {
            expect(() => {
                eventService.updateEvent('999', updateData);
            }).toThrow('Event not found');
        });
    });

    describe('deleteEvent', () => {
        it('should delete an existing event', () => {
            const result = eventService.deleteEvent('1');
            expect(result.message).toBe('Event deleted successfully');
        });

        it('should throw an error when deleting non-existent event', () => {
            expect(() => {
                eventService.deleteEvent('999');
            }).toThrow('Event not found');
        });
    });

    describe('getFormOptions', () => {
        it('should return valid form options', () => {
            const options = eventService.getFormOptions();
            
            expect(options).toHaveProperty('skillOptions');
            expect(options).toHaveProperty('urgencyOptions');
            expect(options).toHaveProperty('stateOptions');
            
            expect(Array.isArray(options.skillOptions)).toBe(true);
            expect(Array.isArray(options.urgencyOptions)).toBe(true);
            expect(Array.isArray(options.stateOptions)).toBe(true);
            
            expect(options.urgencyOptions).toContain('Low');
            expect(options.urgencyOptions).toContain('Medium');
            expect(options.urgencyOptions).toContain('High');
            expect(options.urgencyOptions).toContain('Critical');
        });
    });
});