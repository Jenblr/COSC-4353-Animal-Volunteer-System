const { matchVolunteersToEvent, getFutureEvents } = require('../../services/matchingService');
const eventService = require('../../services/eventService');
const profileService = require('../../services/profileService');

jest.mock('../../services/eventService');
jest.mock('../../services/profileService');

describe('matchingService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('matchVolunteersToEvent', () => {
        const mockEvent = {
            id: '123',
            eventDate: '2024-12-25',
            requiredSkills: ['programming', 'teaching'],
            city: 'New York'
        };

        const mockVolunteers = [
            {
                userId: '1',
                fullName: 'John Doe',
                email: 'john@example.com',
                skills: ['programming', 'design'],
                city: 'New York',
                availability: ['2024-12-25', '2024-12-26']
            },
            {
                userId: '2',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                skills: ['teaching', 'writing'],
                city: 'New York',
                availability: ['2024-12-25']
            },
            {
                userId: '3',
                fullName: 'Bob Wilson',
                email: 'bob@example.com',
                skills: ['programming'],
                city: 'Boston',
                availability: ['2024-12-25']
            }
        ];

        it('should match volunteers based on skills, location, and availability', async () => {
            eventService.getEventById.mockReturnValue(mockEvent);
            profileService.getAllProfiles.mockResolvedValue(mockVolunteers);

            const matches = await matchVolunteersToEvent('123');

            expect(matches).toHaveLength(2);
            expect(matches).toContainEqual(expect.objectContaining({
                id: '1',
                fullName: 'John Doe',
                skills: ['programming']
            }));
            expect(matches).toContainEqual(expect.objectContaining({
                id: '2',
                fullName: 'Jane Smith',
                skills: ['teaching']
            }));
        });

        it('should throw error for non-existent event', async () => {
            eventService.getEventById.mockReturnValue(null);

            await expect(matchVolunteersToEvent('999'))
                .rejects
                .toEqual(expect.objectContaining({
                    status: 404,
                    message: 'Event not found'
                }));
        });

        it('should throw error for past events', async () => {
            const pastEvent = {
                ...mockEvent,
                eventDate: '2023-01-01'
            };
            eventService.getEventById.mockReturnValue(pastEvent);

            await expect(matchVolunteersToEvent('123'))
                .rejects
                .toEqual(expect.objectContaining({
                    status: 400,
                    message: 'Cannot match volunteers to past events'
                }));
        });

        it('should handle string and number event IDs', async () => {
            eventService.getEventById.mockReturnValue(mockEvent);
            profileService.getAllProfiles.mockResolvedValue(mockVolunteers);

            await matchVolunteersToEvent(123);
            expect(eventService.getEventById).toHaveBeenCalledWith('123');

            await matchVolunteersToEvent('123');
            expect(eventService.getEventById).toHaveBeenCalledWith('123');
        });
    });

    describe('getFutureEvents', () => {
        const mockEvents = [
            { id: '1', eventDate: '2024-12-25' },
            { id: '2', eventDate: '2023-01-01' }, 
            { id: '3', eventDate: '2024-12-26' }
        ];

        it('should return only future events', () => {
            eventService.getAllEvents.mockReturnValue(mockEvents);

            const futureEvents = getFutureEvents();

            expect(futureEvents).toHaveLength(2);
            expect(futureEvents).toContainEqual(expect.objectContaining({ id: '1' }));
            expect(futureEvents).toContainEqual(expect.objectContaining({ id: '3' }));
            expect(futureEvents).not.toContainEqual(expect.objectContaining({ id: '2' }));
        });

        it('should handle errors from eventService', () => {
            const error = new Error('Database error');
            eventService.getAllEvents.mockImplementation(() => {
                throw error;
            });

            expect(() => getFutureEvents()).toThrow(error);
        });
    });
});