const reportsController = require('../../controllers/reportsController');
const reportsService = require('../../services/reportsService');

// Mock the reportsService
jest.mock('../../services/reportsService', () => ({
  generateVolunteerReport: jest.fn(),
  generateSpecificVolunteerReport: jest.fn(),
  generateEventReport: jest.fn(),
  generateSpecificEventReport: jest.fn(),
}));

describe('Reports Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Mock request and response objects
    mockReq = {
      query: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getVolunteerReport', () => {
    it('should return a 400 status if the format is invalid', async () => {
      mockReq.query = { format: 'invalid' };

      await reportsController.getVolunteerReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid format specified' });
    });

    it('should return a PDF volunteer report successfully', async () => {
      mockReq.query = { format: 'PDF' };
      reportsService.generateVolunteerReport.mockResolvedValue(Buffer.from('PDF data'));

      await reportsController.getVolunteerReport(mockReq, mockRes);

      expect(reportsService.generateVolunteerReport).toHaveBeenCalledWith('PDF');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="volunteer-report.pdf"'
      );
      expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('PDF data'));
    });

    it('should return a CSV volunteer report successfully', async () => {
      mockReq.query = { format: 'CSV' };
      reportsService.generateVolunteerReport.mockResolvedValue(Buffer.from('CSV data'));

      await reportsController.getVolunteerReport(mockReq, mockRes);

      expect(reportsService.generateVolunteerReport).toHaveBeenCalledWith('CSV');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8');
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="volunteer-report.csv"'
      );
      expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('CSV data'));
    });

    it('should handle errors from the service', async () => {
      mockReq.query = { format: 'PDF' };
      reportsService.generateVolunteerReport.mockRejectedValue(new Error('Service Error'));

      await reportsController.getVolunteerReport(mockReq, mockRes);

      expect(reportsService.generateVolunteerReport).toHaveBeenCalledWith('PDF');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error generating report',
        error: 'Service Error',
      });
    });
  });

  describe('getSpecificVolunteerReport', () => {
    it('should return a 400 status if the format is invalid', async () => {
      mockReq.query = { format: 'invalid' };
      mockReq.params = { id: '1' };

      await reportsController.getSpecificVolunteerReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid format specified' });
    });

    it('should return a specific PDF volunteer report successfully', async () => {
      mockReq.query = { format: 'PDF' };
      mockReq.params = { id: '1' };
      reportsService.generateSpecificVolunteerReport.mockResolvedValue(Buffer.from('PDF data'));

      await reportsController.getSpecificVolunteerReport(mockReq, mockRes);

      expect(reportsService.generateSpecificVolunteerReport).toHaveBeenCalledWith('1', 'PDF');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="volunteer-report.pdf"'
      );
      expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('PDF data'));
    });

    it('should handle errors from the service', async () => {
      mockReq.query = { format: 'PDF' };
      mockReq.params = { id: '1' };
      reportsService.generateSpecificVolunteerReport.mockRejectedValue(
        new Error('Volunteer Not Found')
      );

      await reportsController.getSpecificVolunteerReport(mockReq, mockRes);

      expect(reportsService.generateSpecificVolunteerReport).toHaveBeenCalledWith('1', 'PDF');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error generating report',
        error: 'Volunteer Not Found',
      });
    });
  });

  describe('getEventReport', () => {
    it('should generate an event CSV report successfully', async () => {
      mockReq.query = { format: 'CSV', startDate: '2024-01-01', endDate: '2024-12-31' };
      reportsService.generateEventReport.mockResolvedValue(Buffer.from('CSV data'));

      await reportsController.getEventReport(mockReq, mockRes);

      expect(reportsService.generateEventReport).toHaveBeenCalledWith(
        'CSV',
        '2024-01-01',
        '2024-12-31'
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv; charset=utf-8');
      expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('CSV data'));
    });

    it('should handle errors from the service', async () => {
      mockReq.query = { format: 'CSV', startDate: '2024-01-01', endDate: '2024-12-31' };
      reportsService.generateEventReport.mockRejectedValue(new Error('No events found'));

      await reportsController.getEventReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error generating report',
        error: 'No events found',
      });
    });
  });

  describe('getSpecificEventReport', () => {
    it('should generate a specific event PDF report successfully', async () => {
      mockReq.query = { format: 'PDF' };
      mockReq.params = { id: '1' };
      reportsService.generateSpecificEventReport.mockResolvedValue(Buffer.from('PDF data'));

      await reportsController.getSpecificEventReport(mockReq, mockRes);

      expect(reportsService.generateSpecificEventReport).toHaveBeenCalledWith('1', 'PDF');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
      expect(mockRes.end).toHaveBeenCalledWith(Buffer.from('PDF data'));
    });

    it('should handle errors from the service', async () => {
      mockReq.query = { format: 'PDF' };
      mockReq.params = { id: '1' };
      reportsService.generateSpecificEventReport.mockRejectedValue(new Error('Event not found'));

      await reportsController.getSpecificEventReport(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error generating report',
        error: 'Event not found',
      });
    });
  });
});
