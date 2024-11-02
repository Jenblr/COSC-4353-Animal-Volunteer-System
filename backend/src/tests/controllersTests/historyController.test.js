const historyController = require('../../controllers/historyController');
const historyService = require('../../services/historyService');

jest.mock('../../services/historyService');

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

describe('History Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = mockReq();
        res = mockRes();
        jest.clearAllMocks();
    });

    describe('getAllHistory', () => {
        it('should return all history records with status 200', () => {
            const mockHistory = [{ id: 1, volunteer: 123, event: 456 }];
            historyService.getAllHistory.mockReturnValue(mockHistory);

            historyController.getAllHistory(req, res);

            expect(historyService.getAllHistory).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockHistory);
        });

        // TODO: Add test for async handling when getAllHistory is updated to be async
    });

    describe('getHistory', () => {
        const mockEventData = {
            id: 1,
            Event: {
                eventName: 'Test Event',
                eventDescription: 'Description',
                address: '123 Street',
                city: 'City',
                state: 'State',
                zipCode: '12345',
                requiredSkills: ['Skill1', 'Skill2'],
                urgency: 'High',
                eventDate: '2024-01-01',
                startTime: '09:00',
                endTime: '17:00'
            },
            participationStatus: 'Not Attended'
        };

        it('should return formatted history for a specific user with status 200', async () => {
            req.params.userId = '123';
            historyService.getHistory.mockResolvedValue([mockEventData]);

            await historyController.getHistory(req, res);

            const expectedFormattedHistory = [{
                id: 1,
                eventName: 'Test Event',
                eventDescription: 'Description',
                location: '123 Street, City, State 12345',
                requiredSkills: ['Skill1', 'Skill2'],
                urgency: 'High',
                eventDate: '2024-01-01',
                startTime: '09:00',
                endTime: '17:00',
                participationStatus: 'Not Attended'
            }];

            expect(historyService.getHistory).toHaveBeenCalledWith(123);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expectedFormattedHistory);
        });

        it('should handle service errors with status 500', async () => {
            req.params.userId = '123';
            const error = new Error('Service error');
            historyService.getHistory.mockRejectedValue(error);

            await historyController.getHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error fetching volunteer history',
                error: 'Service error'
            });
        });

        it('should handle invalid user ID parameter', async () => {
            req.params.userId = 'invalid';
            
            await historyController.getHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error fetching volunteer history',
                error: expect.any(String)
            });
        });
    });

    describe('updateHistoryRecord', () => {
        it('should update history record and return status from service', () => {
            req.params.id = '1';
            req.body = { participationStatus: 'Attended' };
            const mockResult = { status: 200, message: 'Record updated' };
            
            historyService.updateHistoryRecord.mockReturnValue(mockResult);

            historyController.updateHistoryRecord(req, res);

            expect(historyService.updateHistoryRecord).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 403 if non-admin tries to update participation status', () => {
            req.userRole = 'volunteer';
            req.body = { participationStatus: 'Attended' };

            historyController.updateHistoryRecord(req, res);

            expect(historyService.updateHistoryRecord).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Only admins can update participation status'
            });
        });

        it('should return 401 if userRole is not present', () => {
            req.userRole = undefined;
            req.body = { participationStatus: 'Attended' };

            historyController.updateHistoryRecord(req, res);

            expect(historyService.updateHistoryRecord).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        });

        it('should allow non-admin to update non-participation status fields', () => {
            req.userRole = 'volunteer';
            req.body = { someOtherField: 'value' };
            const mockResult = { status: 200, message: 'Record updated' };
            
            historyService.updateHistoryRecord.mockReturnValue(mockResult);

            historyController.updateHistoryRecord(req, res);

            expect(historyService.updateHistoryRecord).toHaveBeenCalledWith(undefined, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('updateVolunteerEventStatus', () => {
        it('should successfully update volunteer event status', async () => {
            req.body = { volunteerId: '1', eventId: '2' };
            const mockResult = { success: true, message: 'Volunteer status updated successfully' };
            
            historyService.updateVolunteerEventStatus.mockResolvedValue(mockResult);

            await historyController.updateVolunteerEventStatus(req, res);

            expect(historyService.updateVolunteerEventStatus)
                .toHaveBeenCalledWith('1', '2', 'Matched - Pending Attendance');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 400 if volunteerId is missing', async () => {
            req.body = { eventId: '2' };

            await historyController.updateVolunteerEventStatus(req, res);

            expect(historyService.updateVolunteerEventStatus).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Volunteer ID and Event ID are required'
            });
        });

        it('should return 400 if eventId is missing', async () => {
            req.body = { volunteerId: '1' };

            await historyController.updateVolunteerEventStatus(req, res);

            expect(historyService.updateVolunteerEventStatus).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Volunteer ID and Event ID are required'
            });
        });

        it('should handle service errors with status 500', async () => {
            req.body = { volunteerId: '1', eventId: '2' };
            historyService.updateVolunteerEventStatus.mockRejectedValue(new Error('Service error'));

            await historyController.updateVolunteerEventStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Error updating volunteer status'
            });
        });
    });
});