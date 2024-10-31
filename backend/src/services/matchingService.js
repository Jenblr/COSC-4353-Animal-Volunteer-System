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

exports.matchVolunteerToEvent = async (eventId, volunteerIds) => {
  try {
    const event = await eventService.getEventById(eventId);
    //ensure event exists
    if (!event) {
      throw { status: 404, message: 'Event not found' };
    }

    const results = [];
    //iterate over each volunteerId in the array
    for (let volunteerId of volunteerIds) {
      const volunteer = await profileService.getProfile(volunteerId);

      if (!volunteer) {
        results.push({ volunteerId, message: 'Volunteer not found' });
        continue;
      }
      //validate volunteer availability and location
      if (!volunteer.availability.includes(event.eventDate)) {
        results.push({ volunteerId, message: 'Volunteer is not available on the event date' });
        continue;
      }

      if (volunteer.city !== event.city) {
        results.push({ volunteerId, message: 'Volunteer is not in the same city as the event' });
        continue;
      }

      if (!volunteer.skills.some(skill => event.requiredSkills.includes(skill))) {
        results.push({ volunteerId, message: 'Volunteer does not have the required skills for this event' });
        continue;
      }
      //if everything is okay, match the volunteer
      results.push({ volunteerId, message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` });
    }

    //return results for all volunteers
    return results;
  } catch (error) {
    console.error('Error in matchVolunteerToEvent:', error);
    throw error;
  }
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

}


module.exports = { matchVolunteersToEvent, getFutureEvents };