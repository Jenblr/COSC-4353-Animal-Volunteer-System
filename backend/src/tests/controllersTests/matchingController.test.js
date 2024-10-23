const matchingController = require('../../controllers/matchingController');
const matchingService = require('../../services/matchingService');
const historyService = require('../../services/historyService');

jest.mock('../../services/matchingService');
jest.mock('../../services/historyService');

describe('matchingController', () => {
  afterEach(() => {
      jest.clearAllMocks(); 
  });

  describe('getMatchingVolunteers', () => {
      it('should return an error if matching service fails', async () => {
          const req = { params: { eventId: '123' } };
          const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
          };
          const error = new Error('Error matching volunteers');
          
          matchingService.matchVolunteersToEvent.mockRejectedValue(error);

          await matchingController.getMatchingVolunteers(req, res);

          expect(matchingService.matchVolunteersToEvent).toHaveBeenCalledWith('123');
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Error matching volunteers' }); 
      });
  });

    describe('getFutureEvents', () => {
        it('should return future events', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const futureEvents = [{ id: 1, name: 'Event 1' }];
            
            matchingService.getFutureEvents.mockResolvedValue(futureEvents);

            await matchingController.getFutureEvents(req, res);

            expect(matchingService.getFutureEvents).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(futureEvents);
        });

        it('should return an error if fetching future events fails', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const error = new Error('Error fetching events');
            
            matchingService.getFutureEvents.mockRejectedValue(error);

            await matchingController.getFutureEvents(req, res);

            expect(matchingService.getFutureEvents).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching future events' });
        });
    });

    describe('matchVolunteerToEvent', () => {
      it('should return an error if history service fails', async () => {
          const req = {
              body: { volunteerId: '1', eventId: '123' }
          };
          const res = {
              status: jest.fn().mockReturnThis(),
              json: jest.fn()
          };

          const error = new Error('Error updating history');

          historyService.ensureHistoryExists.mockResolvedValue();
          historyService.updateVolunteerEventStatus.mockRejectedValue(error);

          await matchingController.matchVolunteerToEvent(req, res);

          expect(historyService.updateVolunteerEventStatus).toHaveBeenCalledWith('1', '123', 'Matched - Pending Attendance');
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ message: 'Error updating history' }); 
      });
  });
});