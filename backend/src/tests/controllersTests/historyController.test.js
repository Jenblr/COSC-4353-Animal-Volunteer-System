const historyController = require('../../controllers/historyController');
const historyService = require('../../services/historyService');

const mockReq = () => ({
	params: {},
	body: {},
	userRole: 'admin'
});

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

jest.mock('../../services/historyService', () => ({
	getAllHistory: jest.fn(),
	updateHistoryRecord: jest.fn(),
	updateVolunteerEventStatus: jest.fn()
}));

describe('History Controller', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAllHistory', () => {
		it('should return all history records with status 200', () => {
			const req = mockReq();
			const res = mockRes();
			const mockHistory = [{ id: 1, volunteer: 123, event: 456 }];

			historyService.getAllHistory.mockReturnValue(mockHistory);

			historyController.getAllHistory(req, res);

			expect(historyService.getAllHistory).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockHistory);
		});
	});

	describe('getHistory', () => {
		it('should return history for a specific user with status 200', () => {
			const req = mockReq();
			req.params.userId = 123;
			const res = mockRes();
			const mockHistory = [{ id: 1, volunteer: 123, event: 456 }];

			historyService.getAllHistory.mockReturnValue(mockHistory);

			historyController.getHistory(req, res);

			expect(historyService.getAllHistory).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockHistory);
		});

		it('should return 404 if no history is found for the user', () => {
			const req = mockReq();
			req.params.userId = 999;
			const res = mockRes();
			const mockHistory = [{ id: 1, volunteer: 123, event: 456 }];

			historyService.getAllHistory.mockReturnValue(mockHistory);

			historyController.getHistory(req, res);

			expect(historyService.getAllHistory).toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.json).toHaveBeenCalledWith({ message: 'No history found for this user' });
		});
	});

	describe('updateHistoryRecord', () => {
		it('should update history record and return status 200', () => {
			const req = mockReq();
			req.params.id = 1;
			req.body = { participationStatus: 'Attended' };
			const res = mockRes();
			const mockResult = { status: 200, message: 'Record updated' };

			historyService.updateHistoryRecord.mockReturnValue(mockResult);

			historyController.updateHistoryRecord(req, res);

			expect(historyService.updateHistoryRecord).toHaveBeenCalledWith(1, req.body);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockResult);
		});

		it('should return 403 if a non-admin tries to update participation status', () => {
			const req = mockReq();
			req.userRole = 'volunteer';
			req.body = { participationStatus: 'Attended' };
			const res = mockRes();

			historyController.updateHistoryRecord(req, res);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({ message: 'Only admins can update participation status' });
		});

		it('should return 401 if userRole is not present in request', () => {
			const req = mockReq();
			req.userRole = null;
			req.body = { participationStatus: 'Attended' };
			const res = mockRes();

			historyController.updateHistoryRecord(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
		});
	});

	describe('updateVolunteerEventStatus', () => {
		it('should update volunteer event status and return status 200', async () => {
			const req = mockReq();
			req.body = { volunteerId: 1, eventId: 2 };
			const res = mockRes();
			const mockResult = { status: 200, message: 'Volunteer status updated' };

			historyService.updateVolunteerEventStatus.mockResolvedValue(mockResult);

			await historyController.updateVolunteerEventStatus(req, res);

			expect(historyService.updateVolunteerEventStatus).toHaveBeenCalledWith(1, 2, 'Matched - Pending Attendance');
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(mockResult);
		});

		it('should return 400 if volunteerId or eventId is missing', async () => {
			const req = mockReq();
			req.body = { volunteerId: 1 };
			const res = mockRes();

			await historyController.updateVolunteerEventStatus(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ message: 'Volunteer ID and Event ID are required' });
		});

		it('should handle errors and return 500', async () => {
			const req = mockReq();
			req.body = { volunteerId: 1, eventId: 2 };
			const res = mockRes();

			historyService.updateVolunteerEventStatus.mockRejectedValue(new Error('Database error'));

			await historyController.updateVolunteerEventStatus(req, res);

			expect(historyService.updateVolunteerEventStatus).toHaveBeenCalledWith(1, 2, 'Matched - Pending Attendance');
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({ message: 'Error updating volunteer status' });
		});

	});
});