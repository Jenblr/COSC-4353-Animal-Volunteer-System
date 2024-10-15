const historyController = require('../../controllers/historyController');
const historyService = require('../../services/historyService');

jest.mock('../../services/historyService');

describe('HistoryController', () => {
    describe('getHistory', () => {
        it('should return user history', async () => {
            const req = { userId: '1' };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.getHistory.mockReturnValue([
                { id: 1, date: '2023-07-01', hours: 4, description: 'Dog walking' }
            ]);

            await historyController.getHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
                expect.objectContaining({ description: 'Dog walking' })
            ]));
        });
    });

    describe('addHistoryRecord', () => {
        it('should add a new history record', async () => {
            const req = {
                userId: '1',
                body: {
                    date: '2023-08-01',
                    hours: 3,
                    description: 'Cat feeding'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.addHistoryRecord.mockReturnValue({
                status: 201,
                record: req.body
            });

            await historyController.addHistoryRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: 201,
                record: expect.objectContaining({ description: 'Cat feeding' })
            });
        });
    });

    describe('updateHistoryRecord', () => {
        it('should update an existing history record', async () => {
            const req = {
                userId: '1',
                body: {
                    recordId: 1,
                    date: '2023-07-01',
                    hours: 5,
                    description: 'Extended dog walking'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.updateHistoryRecord.mockReturnValue({
                status: 200,
                record: req.body
            });

            await historyController.updateHistoryRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: 200,
                record: expect.objectContaining({ description: 'Extended dog walking' })
            });
        });

        it('should return 404 if record not found', async () => {
            const req = {
                userId: '1',
                body: {
                    recordId: 999,
                    date: '2023-07-01',
                    hours: 5,
                    description: 'Non-existent record'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.updateHistoryRecord.mockReturnValue({
                status: 404,
                message: 'History record not found'
            });

            await historyController.updateHistoryRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'History record not found'
            }));
        });
    });

    describe('deleteHistoryRecord', () => {
        it('should delete a history record', async () => {
            const req = {
                userId: '1',
                params: { recordId: '1' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.deleteHistoryRecord.mockReturnValue({
                status: 200,
                message: 'History record deleted successfully'
            });

            await historyController.deleteHistoryRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'History record deleted successfully'
            }));
        });

        it('should return 404 if record not found for deletion', async () => {
            const req = {
                userId: '1',
                params: { recordId: '999' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            historyService.deleteHistoryRecord.mockReturnValue({
                status: 404,
                message: 'History record not found'
            });

            await historyController.deleteHistoryRecord(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'History record not found'
            }));
        });
    });
});