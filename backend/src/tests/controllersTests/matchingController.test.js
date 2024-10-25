const matchingController = require('../../controllers/matchingController');
const matchingService = require('../../services/matchingService');
const historyService = require('../../services/historyService');

jest.mock('../../services/matchingService');
jest.mock('../../services/historyService');

describe('matchingController', () => {
	let mockRequest;
	let mockResponse;

	beforeEach(() => {
		mockRequest = {
			params: {},
			body: {}
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		jest.clearAllMocks();
	});

	describe('getMatchingVolunteers', () => {
		it('should return matching volunteers successfully', async () => {
			mockRequest.params.eventId = '123';
			const mockVolunteers = [
				{ id: 1, name: 'John Doe' },
				{ id: 2, name: 'Jane Smith' }
			];

			matchingService.matchVolunteersToEvent.mockResolvedValue(mockVolunteers);

			await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

			expect(matchingService.matchVolunteersToEvent).toHaveBeenCalledWith('123');
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockVolunteers);
		});

		it('should return an error if matching service fails', async () => {
			mockRequest.params.eventId = '123';
			const error = new Error('Error matching volunteers');

			matchingService.matchVolunteersToEvent.mockRejectedValue(error);

			await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

			expect(matchingService.matchVolunteersToEvent).toHaveBeenCalledWith('123');
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Error matching volunteers'
			});
		});

		it('should handle error with custom status code', async () => {
			mockRequest.params.eventId = '123';
			const error = {
				status: 404,
				message: 'Event not found'
			};

			matchingService.matchVolunteersToEvent.mockRejectedValue(error);

			await matchingController.getMatchingVolunteers(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Event not found'
			});
		});
	});

	describe('getFutureEvents', () => {
		it('should return future events', async () => {
			const futureEvents = [{ id: 1, name: 'Event 1' }];

			matchingService.getFutureEvents.mockResolvedValue(futureEvents);

			await matchingController.getFutureEvents(mockRequest, mockResponse);

			expect(matchingService.getFutureEvents).toHaveBeenCalled();
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(futureEvents);
		});

		it('should return an error if fetching future events fails', async () => {
			const error = new Error('Error fetching events');

			matchingService.getFutureEvents.mockRejectedValue(error);

			await matchingController.getFutureEvents(mockRequest, mockResponse);

			expect(matchingService.getFutureEvents).toHaveBeenCalled();
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Error fetching future events'
			});
		});
	});

	describe('matchVolunteerToEvent', () => {
		it('should successfully match volunteer to event', async () => {
			mockRequest.body = { volunteerId: '1', eventId: '123' };
			const mockResult = { status: 'success', message: 'Match created' };

			historyService.ensureHistoryExists.mockResolvedValue();
			historyService.updateVolunteerEventStatus.mockResolvedValue(mockResult);

			await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

			expect(historyService.ensureHistoryExists).toHaveBeenCalledWith('1', '123');
			expect(historyService.updateVolunteerEventStatus).toHaveBeenCalledWith(
				'1',
				'123',
				'Matched - Pending Attendance'
			);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
		});

		it('should return 400 if volunteerId or eventId is missing', async () => {
			mockRequest.body = { volunteerId: '1' };

			await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Volunteer ID and Event ID are required'
			});

			mockRequest.body = { eventId: '123' };

			await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Volunteer ID and Event ID are required'
			});
		});

		it('should return an error if history service fails', async () => {
			mockRequest.body = { volunteerId: '1', eventId: '123' };
			const error = {
				status: 404,
				message: 'History record not found'
			};

			historyService.ensureHistoryExists.mockResolvedValue();
			historyService.updateVolunteerEventStatus.mockRejectedValue(error);

			await matchingController.matchVolunteerToEvent(mockRequest, mockResponse);

			expect(historyService.updateVolunteerEventStatus).toHaveBeenCalledWith(
				'1',
				'123',
				'Matched - Pending Attendance'
			);
			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'History record not found'
			});
		});
	});
});