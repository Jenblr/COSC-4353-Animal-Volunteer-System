const eventService = require('../services/eventService');
const profileService = require('../services/profileService');

const matchVolunteersToEvent = async (eventId) => {
    try {
        console.log('Attempting to match volunteers for event:', eventId);
        
        // Get event details - handle both string and number IDs
        const event = eventService.getEventById(eventId.toString());
        
        if (!event) {
            console.log('Event not found for ID:', eventId);
            throw { status: 404, message: 'Event not found' };
        }

        console.log('Found event:', event);

        // Check if event is in the past
        const eventDate = new Date(event.eventDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (eventDate < today) {
            throw { status: 400, message: 'Cannot match volunteers to past events' };
        }

        // Get all volunteer profiles
        const allProfiles = await profileService.getAllProfiles();
        console.log('Total volunteer profiles found:', allProfiles.length);
        
        // Filter volunteers based on matching criteria
        const matchedVolunteers = allProfiles.filter(volunteer => {
            // Check if volunteer is available on event date
            const isDateAvailable = volunteer.availability.some(date => {
                const availDate = new Date(date);
                return availDate.toISOString().split('T')[0] === event.eventDate;
            });

            // Check if volunteer has at least one matching skill
            const hasMatchingSkill = volunteer.skills.some(skill => 
                event.requiredSkills.includes(skill)
            );

            // Check if volunteer is in same city
            const isSameCity = volunteer.city.toLowerCase() === event.city.toLowerCase();

            const isMatch = isDateAvailable && hasMatchingSkill && isSameCity;
            if (isMatch) {
                console.log('Found matching volunteer:', volunteer.fullName);
            }

            return isMatch;
        });

        console.log('Total matching volunteers found:', matchedVolunteers.length);

        return matchedVolunteers.map(volunteer => ({
            id: volunteer.userId,
            fullName: volunteer.fullName,
            email: volunteer.email,
            skills: volunteer.skills.filter(skill => event.requiredSkills.includes(skill)),
            city: volunteer.city
        }));
    } catch (error) {
        console.error('Error in matchVolunteersToEvent:', error);
        throw error;
    }
};

const getFutureEvents = () => {
    try {
        const allEvents = eventService.getAllEvents();
        console.log('Total events found:', allEvents.length);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = allEvents.filter(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate >= today;
        });

        console.log('Future events found:', futureEvents.length);
        return futureEvents;
    } catch (error) {
        console.error('Error in getFutureEvents:', error);
        throw error;
    }
};

module.exports = { matchVolunteersToEvent, getFutureEvents };