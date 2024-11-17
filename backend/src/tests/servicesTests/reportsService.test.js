const reportsService = require('../../services/reportsService');
const { User, VolunteerHistory, Event, Profile } = require('../../../models');
const PDFDocument = require('pdfkit');

// Mocking the database models
jest.mock('../../../models', () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  VolunteerHistory: jest.fn(),
  Event: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  Profile: jest.fn(),
}));

// Mocking PDFDocument
jest.mock('pdfkit', () => {
  const mockPDFDocument = jest.fn(() => ({
    fontSize: jest.fn().mockReturnThis(),
    font: jest.fn().mockReturnThis(),
    text: jest.fn().mockReturnThis(),
    moveDown: jest.fn().mockReturnThis(),
    addPage: jest.fn().mockReturnThis(),
    end: jest.fn(),
    on: jest.fn((event, callback) => {
      if (event === 'data') callback(Buffer.from('mockPDFData'));
      if (event === 'end') callback();
    }),
  }));
  return mockPDFDocument;
});

describe('reportsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVolunteerReport', () => {
    it('should throw an error if no volunteers are found', async () => {
      User.findAll.mockResolvedValue([]);

      await expect(reportsService.generateVolunteerReport('PDF')).rejects.toThrow(
        'No volunteers found in the system'
      );
    });

    it('should generate a PDF report successfully', async () => {
      const mockVolunteers = [
        {
          email: 'volunteer@example.com',
          Profile: { fullName: 'John Doe', city: 'City', state: 'State' },
          VolunteerHistories: [
            {
              Event: {
                eventName: 'Event 1',
                eventDate: '2024-12-01',
                startTime: '10:00',
                endTime: '12:00',
                city: 'City 1',
                state: 'State 1',
                urgency: 'High',
              },
              participationStatus: 'Attended',
              matchedAt: '2024-11-25',
            },
          ],
        },
      ];

      User.findAll.mockResolvedValue(mockVolunteers);

      const pdfBuffer = await reportsService.generateVolunteerReport('PDF');

      expect(User.findAll).toHaveBeenCalled();
      expect(PDFDocument).toHaveBeenCalled();
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });

    it('should generate a CSV report successfully', async () => {
      const mockVolunteers = [
        {
          email: 'volunteer@example.com',
          Profile: { fullName: 'John Doe', city: 'City', state: 'State' },
          VolunteerHistories: [],
        },
      ];

      User.findAll.mockResolvedValue(mockVolunteers);

      const csvBuffer = await reportsService.generateVolunteerReport('CSV');

      expect(User.findAll).toHaveBeenCalled();
      expect(csvBuffer).toBeInstanceOf(Buffer);
      expect(csvBuffer.toString()).toContain('VOLUNTEER NAME,EMAIL,VOLUNTEER LOCATION');
    });
  });

  describe('generateSpecificVolunteerReport', () => {
    it('should throw an error if the volunteer is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await expect(reportsService.generateSpecificVolunteerReport(1, 'PDF')).rejects.toThrow(
        'Volunteer not found'
      );
    });

    it('should generate a specific volunteer PDF report successfully', async () => {
      const mockVolunteer = {
        email: 'volunteer@example.com',
        Profile: { fullName: 'John Doe', city: 'City', state: 'State' },
        VolunteerHistories: [
          {
            Event: {
              eventName: 'Event 1',
              eventDate: '2024-12-01',
              startTime: '10:00',
              endTime: '12:00',
              city: 'City 1',
              state: 'State 1',
              urgency: 'High',
              requiredSkills: ['Skill 1'],
            },
            participationStatus: 'Matched - Pending Attendance',
            matchedAt: '2024-11-25',
          },
        ],
      };

      User.findOne.mockResolvedValue(mockVolunteer);

      const pdfBuffer = await reportsService.generateSpecificVolunteerReport(1, 'PDF');

      expect(User.findOne).toHaveBeenCalled();
      expect(PDFDocument).toHaveBeenCalled();
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });

    it('should generate a specific volunteer CSV report with no history', async () => {
      const mockVolunteer = {
        email: 'volunteer@example.com',
        Profile: { fullName: 'John Doe', city: 'City', state: 'State' },
        VolunteerHistories: [],
      };

      User.findOne.mockResolvedValue(mockVolunteer);

      const csvBuffer = await reportsService.generateSpecificVolunteerReport(1, 'CSV');
      expect(User.findOne).toHaveBeenCalled();
      expect(csvBuffer.toString()).toContain('No participation history');
    });
  });

  describe('generateEventReport', () => {
    it('should throw an error if no events are found', async () => {
      Event.findAll.mockResolvedValue([]);

      await expect(
        reportsService.generateEventReport('CSV', '2024-11-01', '2024-11-30')
      ).rejects.toThrow('No events found in the specified date range');
    });

    it('should generate an event CSV report successfully', async () => {
      const mockEvents = [
        {
          eventName: 'Event 1',
          eventDate: '2024-11-15',
          city: 'City 1',
          state: 'State 1',
          VolunteerHistories: [
            {
              User: { email: 'volunteer@example.com', Profile: { fullName: 'John Doe' } },
              participationStatus: 'Matched - Pending Attendance',
              matchedAt: '2024-11-10',
            },
          ],
        },
      ];

      Event.findAll.mockResolvedValue(mockEvents);

      const csvBuffer = await reportsService.generateEventReport('CSV', '2024-11-01', '2024-11-30');

      expect(Event.findAll).toHaveBeenCalled();
      expect(csvBuffer).toBeInstanceOf(Buffer);
      expect(csvBuffer.toString()).toContain('Event Name,Date,Location,Total Matched Volunteers');
    });

    it('should throw an error if startDate is after endDate', async () => {
      await expect(
        reportsService.generateEventReport('PDF', '2024-12-31', '2024-01-01')
      ).rejects.toThrow('Invalid date range: startDate must be before endDate');
    });
  });

  describe('generateSpecificEventReport', () => {
    it('should throw an error if the event is not found', async () => {
      Event.findOne.mockResolvedValue(null);

      await expect(reportsService.generateSpecificEventReport(1, 'PDF')).rejects.toThrow(
        'Event not found'
      );
    });

    it('should generate a specific event PDF report successfully', async () => {
      const mockEvent = {
        eventName: 'Event 1',
        eventDate: '2024-11-15',
        city: 'City 1',
        state: 'State 1',
        VolunteerHistories: [
          {
            User: { email: 'volunteer@example.com', Profile: { fullName: 'John Doe' } },
            participationStatus: 'Matched - Pending Attendance',
            matchedAt: '2024-11-10',
          },
        ],
      };

      Event.findOne.mockResolvedValue(mockEvent);

      const pdfBuffer = await reportsService.generateSpecificEventReport(1, 'PDF');

      expect(Event.findOne).toHaveBeenCalled();
      expect(PDFDocument).toHaveBeenCalled();
      expect(pdfBuffer).toBeInstanceOf(Buffer);
    });

    it('should generate a specific event CSV report with no matched volunteers', async () => {
      const mockEvent = {
        eventName: 'Event 1',
        eventDate: '2024-11-15',
        city: 'City 1',
        state: 'State 1',
        VolunteerHistories: [],
      };

      Event.findOne.mockResolvedValue(mockEvent);

      const csvBuffer = await reportsService.generateSpecificEventReport(1, 'CSV');

      expect(Event.findOne).toHaveBeenCalled();
      expect(csvBuffer.toString()).toContain('No Matched Volunteers');
    });
  });
});


