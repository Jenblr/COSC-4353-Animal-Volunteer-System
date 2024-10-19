const eventService = require('../services/eventService');
const profileService = require('../services/profileService');

exports.getMatchingVolunteers = async (eventId) => {
  try {
    const event = await eventService.getEventById(eventId);
    const allProfiles = await profileService.getAllProfiles();

    const matchingVolunteers = allProfiles.filter(volunteer => 
      volunteer.availability.some(date => new Date(date).toDateString() === new Date(event.eventDate).toDateString()) &&
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
    
    if (!event) {
      throw { status: 404, message: 'Event not found' };
    }

    const results = [];

    for (let volunteerId of volunteerIds) {
      // Convert volunteerId to a number to match the profile userId type
      const numericVolunteerId = Number(volunteerId);
      
      if (isNaN(numericVolunteerId)) {
        results.push({ volunteerId, message: 'Invalid volunteer ID' });
        continue;
      }

      const volunteer = await profileService.getProfile(numericVolunteerId);

      if (!volunteer) {
        results.push({ volunteerId, message: 'Volunteer not found' });
        continue;
      }

      if (!volunteer.availability.some(date => new Date(date).toDateString() === new Date(event.eventDate).toDateString())) {
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

      results.push({ volunteerId, message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` });
    }

    return results;
  } catch (error) {
    console.error('Error in matchVolunteerToEvent:', error);
    throw error;
  }
}; 