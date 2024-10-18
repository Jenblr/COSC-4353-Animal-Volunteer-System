//matchingService.js
const eventService = require('./eventService');
const profileService = require('./profileService');

exports.getMatchingVolunteers = async (eventId) => {
  try {
    const event = await eventService.getEventById(eventId);
    const allProfiles = await profileService.getAllProfiles();

    const matchingVolunteers = allProfiles.filter(volunteer => 
      volunteer.availability.includes(event.eventDate) &&
      volunteer.city === event.city &&
      volunteer.skills.some(skill => event.requiredSkills.includes(skill))
    );

    if (matchingVolunteers.length === 0) {
      return { message: "No matching volunteers found for this event." };
    }

    return matchingVolunteers;
  } catch (error) {
    console.error('Error in getMatchingVolunteers:', error);
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
};



