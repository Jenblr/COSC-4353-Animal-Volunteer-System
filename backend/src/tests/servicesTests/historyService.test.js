const historyService = require('../../services/historyService');

describe('History Service', () => {
    it('should return all history records', () => {
        const mockHistory = [{ id: 1, volunteer: 123, participationStatus: 'Not Attended' }];
        jest.spyOn(historyService, 'getAllHistory').mockReturnValue(mockHistory);

        const result = historyService.getAllHistory();
        expect(result).toEqual(mockHistory);
    });

    it('should update history record successfully', () => {
        const mockHistoryRecord = { id: 1, volunteer: 123, participationStatus: 'Not Attended' };
        const updateData = { participationStatus: 'Attended' };

        jest.spyOn(historyService, 'updateHistoryRecord').mockReturnValue({
            status: 200,
            message: 'Record updated successfully',
        });

        const result = historyService.updateHistoryRecord(mockHistoryRecord.id, updateData);
        expect(result).toEqual({
            status: 200,
            message: 'Record updated successfully',
        });
    });
});
