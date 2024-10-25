const historyService = require('../services/historyService');

exports.getAllHistory = (req, res) => {
	console.log('Controller: Fetching all history records');
	const allHistory = historyService.getAllHistory();
	res.status(200).json(allHistory);
};

exports.getHistory = (req, res) => {
	const userId = parseInt(req.params.userId, 10);
	console.log('Controller: Fetching history for userId:', userId);
	const allHistory = historyService.getAllHistory();
	const userHistory = allHistory.filter(record => record.volunteer === userId);
    
	if (userHistory.length === 0) {
		return res.status(404).json({ message: 'No history found for this user' });
	}
    
	res.status(200).json(userHistory);
};

exports.updateHistoryRecord = (req, res) => {
	const { id } = req.params;
	const updateData = req.body;

	if (!req.userRole) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.userRole !== 'admin' && updateData.participationStatus !== undefined) {
		return res.status(403).json({ message: 'Only admins can update participation status' });
	}    

	const result = historyService.updateHistoryRecord(id, updateData);
	res.status(result.status).json(result);
};

exports.updateVolunteerEventStatus = async (req, res) => {
	try {
		const { volunteerId, eventId } = req.body;
		if (!volunteerId || !eventId) {
			return res.status(400).json({ message: 'Volunteer ID and Event ID are required' });
		}

		const result = await historyService.updateVolunteerEventStatus(volunteerId, eventId, 'Matched - Pending Attendance');
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({ message: 'Error updating volunteer status' });
	}
};