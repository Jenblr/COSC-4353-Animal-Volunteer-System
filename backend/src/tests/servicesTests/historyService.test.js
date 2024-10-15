const historyService = require('../../services/historyService');

describe('HistoryService', () => {
    describe('getHistory', () => {
        it('should return history for an existing user', () => {
            const userHistory = historyService.getHistory('Adam Larson');
            expect(userHistory).toBeDefined();
            expect(userHistory.length).toBe(1);
            expect(userHistory[0].eventName).toBe('Pet Training Workshop');
        });

        it('should return an empty array for a non-existent user', () => {
            const userHistory = historyService.getHistory('Non-existent User');
            expect(userHistory).toEqual([]);
        });
    });

    describe('addHistoryRecord', () => {
        it('should add a new history record', () => {
            const newRecord = {
                volunteer: 'Test User',
                eventName: 'Test Event',
                eventDescription: 'Test Description',
                location: 'Test Location',
                requiredSkills: ['Test Skill'],
                urgency: 'High',
                eventDate: '2023-12-01',
                participationStatus: 'Pending'
            };
            const response = historyService.addHistoryRecord('Test User', newRecord);
            expect(response.status).toBe(201);
            expect(response.record).toMatchObject(newRecord);
        });
    });

    describe('updateHistoryRecord', () => {
        it('should update an existing history record', () => {
            const updatedData = {
                eventName: 'Updated Event',
                participationStatus: 'Confirmed'
            };
            const response = historyService.updateHistoryRecord('Adam Larson', 1, updatedData);
            expect(response.status).toBe(200);
            expect(response.record.eventName).toBe('Updated Event');
            expect(response.record.participationStatus).toBe('Confirmed');
        });

        it('should return 404 if record not found', () => {
            const response = historyService.updateHistoryRecord('Adam Larson', 999, {});
            expect(response.status).toBe(404);
        });
    });

    describe('deleteHistoryRecord', () => {
        it('should delete an existing history record', () => {
            const response = historyService.deleteHistoryRecord('Adam Larson', 1);
            expect(response.status).toBe(200);
            expect(response.message).toBe('Record deleted successfully');
        });

        it('should return 404 if record not found', () => {
            const response = historyService.deleteHistoryRecord('Adam Larson', 999);
            expect(response.status).toBe(404);
        });
    });
});