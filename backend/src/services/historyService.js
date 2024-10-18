const eventService = require('../services/eventService');
const authService = require('../services/authService');

let volunteerHistory = []; // Define volunteerHistory at the top level

const initializeHistory = () => {
    console.log('Initializing history records');
    const allEvents = eventService.getAllEvents();
    const allVolunteers = authService.getAllVolunteers();
    
    volunteerHistory = []; // Reset the history array

    allVolunteers.forEach(volunteer => {
        allEvents.forEach(event => {
            const historyRecord = {
                id: `${volunteer.id}-${event.id}`, // Unique ID for each history record
                volunteer: volunteer.id,
                eventId: event.id,
                eventName: event.eventName,
                eventDescription: event.eventDescription,
                location: `${event.address1}, ${event.city}, ${event.state} ${event.zipCode}`,
                requiredSkills: event.requiredSkills,
                urgency: event.urgency,
                eventDate: event.eventDate,
                startTime: event.startTime,
                endTime: event.endTime,
                participationStatus: 'Not Attended' // Default status
            };
            volunteerHistory.push(historyRecord);
        });
    });

    console.log('Current volunteerHistory:', JSON.stringify(volunteerHistory, null, 2));
};

exports.getAllHistory = () => {
    if (volunteerHistory.length === 0) {
        initializeHistory();
    }
    return volunteerHistory;
};

exports.getHistory = (userId) => {
    console.log('Fetching history for userId:', userId);
    return volunteerHistory.filter(record => record.volunteer === userId);
};

exports.updateHistoryRecord = (recordId, updateData) => {
    console.log('Updating record. RecordId:', recordId);
    const recordIndex = volunteerHistory.findIndex(r => r.id === recordId);
    
    if (recordIndex === -1) {
        return { status: 404, message: 'History record not found' };
    }

    volunteerHistory[recordIndex] = { ...volunteerHistory[recordIndex], ...updateData };
    return { status: 200, record: volunteerHistory[recordIndex] };
};