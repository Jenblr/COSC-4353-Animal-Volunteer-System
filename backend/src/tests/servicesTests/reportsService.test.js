const { User, Event } = require('../../../models');
const reportsService = require('../../services/reportsService');

jest.mock('../../../models', () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn()
  },
  Profile: {},
  VolunteerHistory: {},
  Event: {
    findAll: jest.fn(),
    findOne: jest.fn()
  }
}));

jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn((event, callback) => {
      if (event === 'end') callback();
    }),
    end: jest.fn(),
    fontSize: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    addPage: jest.fn().mockReturnThis()
  }));
});

describe('reportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVolunteerReport', () => {
    const mockVolunteers = [
      {
        id: 1,
        email: 'volunteer1@test.com',
        Profile: {
          fullName: 'Test Volunteer 1',
          city: 'Test City',
          state: 'TS'
        },
        VolunteerHistories: [
          {
            Event: {
              eventName: 'Test Event 1',
              eventDate: '2024-01-01',
              startTime: '09:00',
              endTime: '17:00',
              city: 'Test City',
              state: 'TS',
              urgency: 'High'
            },
            participationStatus: 'Attended',
            matchedAt: '2024-01-01'
          }
        ]
      }
    ];

    it('should generate PDF report successfully', async () => {
      User.findAll.mockResolvedValueOnce(mockVolunteers);

      const result = await reportsService.generateVolunteerReport('PDF');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should generate CSV report successfully', async () => {
      User.findAll.mockResolvedValueOnce(mockVolunteers);

      const result = await reportsService.generateVolunteerReport('CSV');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should throw error when no volunteers found', async () => {
      User.findAll.mockResolvedValueOnce([]);

      await expect(reportsService.generateVolunteerReport('PDF'))
        .rejects
        .toThrow('No volunteers found in the system');
    });
  });

  describe('generateSpecificVolunteerReport', () => {
    const mockVolunteer = {
      id: 1,
      email: 'volunteer1@test.com',
      Profile: {
        fullName: 'Test Volunteer 1',
        city: 'Test City',
        state: 'TS',
        skills: ['Skill 1', 'Skill 2']
      },
      VolunteerHistories: [
        {
          Event: {
            eventName: 'Test Event 1',
            eventDescription: 'Test Description',
            eventDate: '2024-01-01',
            startTime: '09:00',
            endTime: '17:00',
            city: 'Test City',
            state: 'TS',
            urgency: 'High',
            requiredSkills: ['Skill 1']
          },
          participationStatus: 'Attended',
          matchedAt: '2024-01-01'
        }
      ]
    };

    it('should generate specific volunteer PDF report', async () => {
      User.findOne.mockResolvedValueOnce(mockVolunteer);

      const result = await reportsService.generateSpecificVolunteerReport(1, 'PDF');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should generate specific volunteer CSV report', async () => {
      User.findOne.mockResolvedValueOnce(mockVolunteer);

      const result = await reportsService.generateSpecificVolunteerReport(1, 'CSV');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should throw error when volunteer not found', async () => {
      User.findOne.mockResolvedValueOnce(null);

      await expect(reportsService.generateSpecificVolunteerReport(999, 'PDF'))
        .rejects
        .toThrow('Volunteer not found');
    });
  });

  describe('generateEventReport', () => {
    const mockEvents = [
      {
        id: 1,
        eventName: 'Test Event 1',
        eventDate: '2024-01-01',
        eventDescription: 'Test Description',
        city: 'Test City',
        state: 'TS',
        urgency: 'High',
        VolunteerHistories: [
          {
            participationStatus: 'Matched - Pending Attendance',
            matchedAt: '2024-01-01',
            User: {
              Profile: {
                fullName: 'Test Volunteer'
              },
              email: 'volunteer@test.com'
            }
          }
        ]
      }
    ];

    it('should generate event PDF report', async () => {
      Event.findAll.mockResolvedValueOnce(mockEvents);

      const result = await reportsService.generateEventReport(
        'PDF',
        '2024-01-01',
        '2024-12-31'
      );
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should generate event CSV report', async () => {
      Event.findAll.mockResolvedValueOnce(mockEvents);

      const result = await reportsService.generateEventReport(
        'CSV',
        '2024-01-01',
        '2024-12-31'
      );
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should throw error when no events found', async () => {
      Event.findAll.mockResolvedValueOnce([]);

      await expect(reportsService.generateEventReport('PDF', '2024-01-01', '2024-12-31'))
        .rejects
        .toThrow('No events found in the specified date range');
    });
  });

  describe('generateSpecificEventReport', () => {
    const mockEvent = {
      id: 1,
      eventName: 'Test Event 1',
      eventDate: '2024-01-01',
      eventDescription: 'Test Description',
      city: 'Test City',
      state: 'TS',
      urgency: 'High',
      VolunteerHistories: [
        {
          participationStatus: 'Matched - Pending Attendance',
          matchedAt: '2024-01-01',
          User: {
            Profile: {
              fullName: 'Test Volunteer'
            },
            email: 'volunteer@test.com'
          }
        }
      ]
    };

    it('should generate specific event PDF report', async () => {
      Event.findOne.mockResolvedValueOnce(mockEvent);

      const result = await reportsService.generateSpecificEventReport(1, 'PDF');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should generate specific event CSV report', async () => {
      Event.findOne.mockResolvedValueOnce(mockEvent);

      const result = await reportsService.generateSpecificEventReport(1, 'CSV');
      expect(result).toBeDefined();
      expect(Buffer.isBuffer(result)).toBeTruthy();
    });

    it('should throw error when event not found', async () => {
      Event.findOne.mockResolvedValueOnce(null);

      await expect(reportsService.generateSpecificEventReport(999, 'PDF'))
        .rejects
        .toThrow('Event not found');
    });
  });

  describe('Error handling', () => {
    it('should handle database errors in generateVolunteerReport', async () => {
      User.findAll.mockRejectedValueOnce(new Error('Database error'));

      await expect(reportsService.generateVolunteerReport('PDF'))
        .rejects
        .toThrow('Database error');
    });

    it('should handle database errors in generateEventReport', async () => {
      Event.findAll.mockRejectedValueOnce(new Error('Database error'));

      await expect(reportsService.generateEventReport('PDF', '2024-01-01', '2024-12-31'))
        .rejects
        .toThrow('Database error');
    });
  });
});