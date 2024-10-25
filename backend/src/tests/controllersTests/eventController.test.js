const eventController = require('../../controllers/eventController');
const eventService = require('../../services/eventService');

jest.mock('../../services/eventService');

describe('Event Controller', () => {
	let mockRequest;
	let mockResponse;

	beforeEach(() => {
		mockRequest = {
			body: {},
			params: {}
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		jest.clearAllMocks();
	});

	test('createEvent should return 201 status on success', async () => {
		const mockEvent = { id: 1, eventName: 'Test Event' };
		eventService.createEvent.mockResolvedValue({ message: 'Event created successfully', event: mockEvent });

		await eventController.createEvent(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event created successfully', event: mockEvent });
	});

	test('getAllEvents should return 200 status with events', async () => {
		const mockEvents = [{ id: 1, eventName: 'Event 1' }, { id: 2, eventName: 'Event 2' }];
		eventService.getAllEvents.mockResolvedValue(mockEvents);

		await eventController.getAllEvents(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
	});

	test('getEventById should return 200 status with event', async () => {
		const mockEvent = { id: 1, eventName: 'Test Event' };
		mockRequest.params.id = '1';
		eventService.getEventById.mockResolvedValue(mockEvent);

		await eventController.getEventById(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
	});

	test('updateEvent should return 200 status on success', async () => {
		const mockEvent = { id: 1, eventName: 'Updated Event' };
		mockRequest.params.id = '1';
		mockRequest.body = { eventName: 'Updated Event' };
		eventService.updateEvent.mockResolvedValue({ message: 'Event updated successfully', event: mockEvent });

		await eventController.updateEvent(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event updated successfully', event: mockEvent });
	});

	test('deleteEvent should return 200 status on success', async () => {
		mockRequest.params.id = '1';
		eventService.deleteEvent.mockResolvedValue({ message: 'Event deleted successfully' });

		await eventController.deleteEvent(mockRequest, mockResponse);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event deleted successfully' });
	});
	test('createEvent should handle service errors', async () => {
		eventService.createEvent.mockRejectedValue(new Error('Service error'));
		await eventController.createEvent(mockRequest, mockResponse);
		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
			message: 'Internal server error'
		}));
	});

	test('getAllEvents should handle empty event list', async () => {
		eventService.getAllEvents.mockResolvedValue([]);
		await eventController.getAllEvents(mockRequest, mockResponse);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith([]);
	});

	test('getEventById should handle non-existent event', async () => {
		mockRequest.params.id = '999';
		eventService.getEventById.mockRejectedValue({ status: 404, message: 'Event not found' });
		await eventController.getEventById(mockRequest, mockResponse);
		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
	});

	test('updateEvent should handle invalid input', async () => {
		mockRequest.params.id = '1';
		mockRequest.body = { eventName: '' };
		eventService.updateEvent.mockRejectedValue({ status: 400, errors: { eventName: 'Event Name is required' } });
		await eventController.updateEvent(mockRequest, mockResponse);
		expect(mockResponse.status).toHaveBeenCalledWith(400);
		expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
			errors: expect.objectContaining({ eventName: 'Event Name is required' })
		}));
	});

	test('deleteEvent should handle non-existent event', async () => {
		mockRequest.params.id = '999';
		eventService.deleteEvent.mockRejectedValue({ status: 404, message: 'Event not found' });
		await eventController.deleteEvent(mockRequest, mockResponse);
		expect(mockResponse.status).toHaveBeenCalledWith(404);
		expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
	});

	describe('Error Handling', () => {
		test('createEvent should handle bad request errors', async () => {
			const validationError = {
				status: 400,
				errors: {
					eventName: 'Event name is required',
					date: 'Invalid date format'
				}
			};
			eventService.createEvent.mockRejectedValue(validationError);

			await eventController.createEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: validationError.errors
			});
		});

		test('getAllEvents should handle internal server errors', async () => {
			const serverError = new Error('Database connection failed');
			eventService.getAllEvents.mockRejectedValue(serverError);

			await eventController.getAllEvents(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Internal server error',
				error: serverError.message
			});
		});

		test('updateEvent should handle bad request without specific errors', async () => {
			mockRequest.params.id = '1';
			mockRequest.body = { invalidField: 'test' };

			const badRequestError = {
				status: 400
			};
			eventService.updateEvent.mockRejectedValue(badRequestError);

			await eventController.updateEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: 'Bad request'
			});
		});

		test('deleteEvent should handle internal server errors', async () => {
			mockRequest.params.id = '1';
			const serverError = new Error('Database error');
			eventService.deleteEvent.mockRejectedValue(serverError);

			await eventController.deleteEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Internal server error',
				error: serverError.message
			});
		});

		test('getFormOptions should handle internal server errors', async () => {
			const serverError = new Error('Failed to fetch form options');
			eventService.getFormOptions.mockRejectedValue(serverError);

			await eventController.getFormOptions(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Internal server error',
				error: serverError.message
			});
		});

		test('updateEvent should handle undefined error status', async () => {
			mockRequest.params.id = '1';
			const unknownError = new Error('Unknown error');
			eventService.updateEvent.mockRejectedValue(unknownError);

			await eventController.updateEvent(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Internal server error',
				error: unknownError.message
			});
		});

		test('getEventById should handle undefined error status', async () => {
			mockRequest.params.id = '1';
			const unknownError = new Error('Unknown error');
			eventService.getEventById.mockRejectedValue(unknownError);

			await eventController.getEventById(mockRequest, mockResponse);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Internal server error',
				error: unknownError.message
			});
		});
	});
});