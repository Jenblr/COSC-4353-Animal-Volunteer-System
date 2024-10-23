const historyService = require('../../services/historyService');
const eventService = require('../../services/eventService');
const authService = require('../../services/authService');

jest.mock('../../services/eventService');
jest.mock('../../services/authService');

describe('History Service', () => {
    const mockEvent = {
        id: '1',
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

    const mockVolunteer = {
        id: '1',
        email: 'test@example.com'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        historyService._reset(); 
        eventService.getAllEvents.mockReturnValue([mockEvent]);
        authService.getAllVolunteers.mockReturnValue([mockVolunteer]);
    });

    describe('getAllHistory', () => {
        it('should initialize history if empty', () => {
            const history = historyService.getAllHistory();
            
            expect(Array.isArray(history)).toBe(true);
            expect(history.length).toBeGreaterThan(0);
            expect(eventService.getAllEvents).toHaveBeenCalledTimes(1);
            expect(authService.getAllVolunteers).toHaveBeenCalledTimes(1);
        });

        it('should return existing history if not empty', () => {
            const firstCall = historyService.getAllHistory();
            const secondCall = historyService.getAllHistory();
            
            expect(firstCall).toEqual(secondCall);
            expect(eventService.getAllEvents).toHaveBeenCalledTimes(1);
        });
    });

    describe('getHistory', () => {
        it('should return history for specific user', () => {
            const userHistory = historyService.getHistory('1');
            
            expect(Array.isArray(userHistory)).toBe(true);
            expect(userHistory.every(record => record.volunteer === '1')).toBe(true);
        });

        it('should return empty array for non-existent user', () => {
            const userHistory = historyService.getHistory('999');
            expect(userHistory).toEqual([]);
        });
    });

    describe('updateVolunteerEventStatus', () => {
        it('should update status successfully', async () => {
            historyService.getAllHistory();

            const result = await historyService.updateVolunteerEventStatus('1', '1', 'Matched - Pending Attendance');
            
            expect(result.status).toBe(200);
            expect(result.record.participationStatus).toBe('Matched - Pending Attendance');
            expect(result.record.matchedAt).toBeTruthy();
        });

        it('should throw error for non-existent record', async () => {
            await expect(
                historyService.updateVolunteerEventStatus('999', '999', 'Matched - Pending Attendance')
            ).rejects.toThrow('History record not found');
        });
    });

    describe('updateHistoryRecord', () => {
        it('should update history record with new data', () => {
            historyService.getAllHistory();

            const updateData = {
                participationStatus: 'Attended'
            };

            const result = historyService.updateHistoryRecord('1-1', updateData);
            
            expect(result.status).toBe(200);
            expect(result.record.participationStatus).toBe('Attended');
        });

        it('should return error for non-existent record', () => {
            const result = historyService.updateHistoryRecord('999-999', {});
            expect(result.status).toBe(404);
        });
    });

    describe('ensureHistoryExists', () => {
        it('should initialize history if record not found', () => {
            const record = historyService.ensureHistoryExists('1', '1');
            expect(record).toBeTruthy();
            expect(record.id).toBe('1-1');
        });
    });
});