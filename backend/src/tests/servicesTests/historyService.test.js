const historyService = require('../../services/historyService');
const eventService = require('../../services/eventService');
const authService = require('../../services/authService');

jest.mock('../../services/eventService');
jest.mock('../../services/authService');

describe('History Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeHistory', () => {
    it('should initialize volunteer history correctly', () => {
      const mockEvents = [
        { id: 'event1', eventName: 'Event 1', eventDescription: 'Desc 1', address1: '123 Main St', city: 'City', state: 'State', zipCode: '12345', requiredSkills: ['Skill1'], urgency: 'High', eventDate: '2023-01-01', startTime: '09:00', endTime: '17:00' },
      ];
      const mockVolunteers = [{ id: 'vol1' }];

      eventService.getAllEvents.mockReturnValue(mockEvents);
      authService.getAllVolunteers.mockReturnValue(mockVolunteers);

      historyService.getAllHistory();

      const allHistory = historyService.getAllHistory();
      expect(allHistory).toHaveLength(1);
      expect(allHistory[0]).toMatchObject({
        id: 'vol1-event1',
        volunteer: 'vol1',
        eventId: 'event1',
        eventName: 'Event 1',
        participationStatus: 'Not Attended',
      });
    });
  });

  describe('getAllHistory', () => {
    it('should return all history records', () => {
      const mockHistory = [{ id: 'record1', volunteer: 'vol1', participationStatus: 'Not Attended' }];
      jest.spyOn(historyService, 'getAllHistory').mockReturnValue(mockHistory);

      const result = historyService.getAllHistory();
      expect(result).toEqual(mockHistory);
    });
  });

  describe('getHistory', () => {
    it('should return history for a specific user', () => {
      const mockHistory = [
        { id: 'record1', volunteer: 'vol1', participationStatus: 'Not Attended' },
        { id: 'record2', volunteer: 'vol2', participationStatus: 'Attended' },
      ];
      jest.spyOn(historyService, 'getAllHistory').mockReturnValue(mockHistory);

      const result = historyService.getHistory('vol1');
      expect(result).toHaveLength(1);
      expect(result[0].volunteer).toBe('vol1');
    });

    it('should return empty array for non-existent user', () => {
      const mockHistory = [
        { id: 'record1', volunteer: 'vol1', participationStatus: 'Not Attended' },
      ];
      jest.spyOn(historyService, 'getAllHistory').mockReturnValue(mockHistory);

      const result = historyService.getHistory('vol2');
      expect(result).toHaveLength(0);
    });
  });

});