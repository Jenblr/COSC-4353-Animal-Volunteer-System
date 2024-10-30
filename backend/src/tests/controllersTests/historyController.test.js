const historyController = require('../../controllers/historyController');
const historyService = require('../../services/historyService');

jest.mock('../../services/historyService');

describe('History Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all history records', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockHistory = [{ id: 1, volunteer: 123, participationStatus: 'Not Attended' }];

        historyService.getAllHistory.mockReturnValue(mockHistory);

        historyController.getAllHistory(req, res);

        expect(historyService.getAllHistory).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it('should fetch user history by userId', () => {
        const req = { params: { userId: 123 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockHistory = [{ id: 1, volunteer: 123, participationStatus: 'Not Attended' }];

        historyService.getAllHistory.mockReturnValue(mockHistory);

        historyController.getHistory(req, res);

        expect(historyService.getAllHistory).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it('should return 404 if no history found for user', () => {
        const req = { params: { userId: 999 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        historyService.getAllHistory.mockReturnValue([]);

        historyController.getHistory(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No history found for this user' });
    });

    it('should return 401 if user is unauthorized to update a record', () => {
        const req = { params: { id: 1 }, body: { participationStatus: 'Attended' }, userRole: null };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        historyController.updateHistoryRecord(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 403 if non-admin tries to update participation status', () => {
        const req = { params: { id: 1 }, body: { participationStatus: 'Attended' }, userRole: 'user' };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        historyController.updateHistoryRecord(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Only admins can update participation status' });
    });
});