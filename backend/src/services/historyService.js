const eventService = require('../services/eventService');
const authService = require('../services/authService');

let volunteerHistory = [];
let isInitialized = false;

const initializeHistory = () => {
    if (isInitialized) {
        return volunteerHistory;
    }

    console.log('Initializing history records');
    const allEvents = eventService.getAllEvents();
    const allVolunteers = authService.getAllVolunteers();
    
    const newHistory = [];

    allVolunteers.forEach(volunteer => {
        allEvents.forEach(event => {
            const historyRecord = {
                id: `${volunteer.id}-${event.id}`, 
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
                participationStatus: 'Not Attended' 
            };
            newHistory.push(historyRecord);
        });
    });

    volunteerHistory = newHistory;
    isInitialized = true;
    console.log('History records initialized:', volunteerHistory.length);
    return newHistory;
};

const ensureHistoryExists = (volunteerId, eventId) => {
    if (!isInitialized) {
        initializeHistory();
    }
    
    const recordId = `${volunteerId}-${eventId}`;
    return volunteerHistory.find(record => record.id === recordId);
};

exports.getAllHistory = () => {
    if (!isInitialized) {
        initializeHistory();
    }
    return volunteerHistory;
};

exports.getHistory = (userId) => {
    if (!isInitialized) {
        initializeHistory();
    }
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

exports.updateVolunteerEventStatus = async (volunteerId, eventId, newStatus) => {
    try {
        console.log(`Updating status for volunteer ${volunteerId} and event ${eventId}`);
        
        const existingRecord = ensureHistoryExists(volunteerId, eventId);
        if (!existingRecord) {
            console.log('No history record found for:', { volunteerId, eventId });
            throw new Error('History record not found');
        }

        const recordId = `${volunteerId}-${eventId}`;
        return this.updateHistoryRecord(recordId, {
            participationStatus: newStatus,
            matchedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating volunteer event status:', error);
        throw error;
    }
};

// For testing purposes
exports._reset = () => {
    volunteerHistory = [];
    isInitialized = false;
};

exports.ensureHistoryExists = ensureHistoryExists;