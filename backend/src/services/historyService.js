const eventService = require('../services/eventService');
const authService = require('../services/authService');

let volunteerHistory = []; 

const initializeHistory = () => {
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
    console.log('History records initialized:', volunteerHistory.length);
    return newHistory;
};

const ensureHistoryExists = (volunteerId, eventId) => {
    const recordId = `${volunteerId}-${eventId}`;
    const existingRecord = volunteerHistory.find(record => record.id === recordId);
    
    if (!existingRecord) {
        console.log('History record not found, initializing records...');
        initializeHistory();
    }
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

exports.updateVolunteerEventStatus = (volunteerId, eventId, newStatus) => {
    try {
        console.log(`Updating status for volunteer ${volunteerId} and event ${eventId}`);

        ensureHistoryExists(volunteerId, eventId);
        
        // Find the specific history record
        const recordId = `${volunteerId}-${eventId}`;
        const recordIndex = volunteerHistory.findIndex(record => 
            record.id === recordId
        );

        if (recordIndex === -1) {
            console.log('No history record found for:', { volunteerId, eventId });
            throw { status: 404, message: 'History record not found' };
        }

        // Update the status
        volunteerHistory[recordIndex] = {
            ...volunteerHistory[recordIndex],
            participationStatus: newStatus,
            matchedAt: new Date().toISOString()
        };

        console.log('Updated history record:', volunteerHistory[recordIndex]);
        return { 
            status: 200, 
            message: 'Status updated successfully',
            record: volunteerHistory[recordIndex]
        };
    } catch (error) {
        console.error('Error updating volunteer event status:', error);
        throw error;
    }
};