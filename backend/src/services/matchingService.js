//matchingService.js
const eventService = require('../services/eventService');
const profileService = require('../services/profileService');

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
    
    // Ensure event exists
    if (!event) {
      throw { status: 404, message: 'Event not found' };
    }

    const results = [];

    // Iterate over each volunteerId in the array
    for (let volunteerId of volunteerIds) {
      const volunteer = await profileService.getProfile(volunteerId);

      if (!volunteer) {
        results.push({ volunteerId, message: 'Volunteer not found' });
        continue;
      }

      // Validate volunteer availability and location
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

      // If everything is okay, match the volunteer
      results.push({ volunteerId, message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` });
    }

    // Return results for all volunteers
    return results;
  } catch (error) {
    console.error('Error in matchVolunteerToEvent:', error);
    throw error;
  }
};



// //sample volunteer data
// const volunteers = [
//   {
//     userId: '1',
//     fullName: 'John Doe',
//     address1: '123 Main St',
//     address2: 'Apt 4B',
//     city: 'Anytown',
//     state: 'CA',
//     zipCode: '12345',
//     skills: ['Animal Care', 'Feeding'],
//     preferences: 'Prefer working with dogs',
//     availability: ['2024-06-01', '2024-06-15', '2024-06-30']
//   },
//   {
//     userId: '2',
//     fullName: 'Jane Smith',
//     address1: '456 Elm St',
//     address2: '',
//     city: 'Houston',
//     state: 'TX',
//     zipCode: '67890',
//     skills: ['Grooming', 'Medication Administration', 'Cleaning'],
//     preferences: 'Available on weekends',
//     availability: ['2024-10-15', '2024-07-15', '2024-07-30']
//   }
// ];


// exports.matchVolunteerToEvent = async (eventId, volunteerId) => {
//   const event = await eventService.getEventById(eventId);
//   const volunteer = volunteers.find(v => v.userId === volunteerId);

//   if (!volunteer) {
//     throw { status: 400, message: 'Volunteer not found' };
//   }

//   if (!volunteer.availability.includes(event.eventDate)) {
//     throw { status: 400, message: 'Volunteer is not available on the event date' };
//   }

//   if (volunteer.city !== event.city) {
//     throw { status: 400, message: 'Volunteer is not in the same city as the event' };
//   }

//   if (!volunteer.skills.some(skill => event.requiredSkills.includes(skill))) {
//     throw { status: 400, message: 'Volunteer does not have the required skills for this event' };
//   }

//   //update the database here
//   //return a success message
//   return { message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` };
// };
// const eventService = require('./eventService');
// const profileService = require('./profileService');



// exports.getMatchingVolunteers = async (eventId) => {
//   try {
//     const event = await eventService.getEventById(eventId);
//     const allProfiles = await profileService.getAllProfiles();

//     const matchingVolunteers = allProfiles.filter(volunteer => 
//       volunteer.availability.includes(event.eventDate) &&
//       volunteer.city === event.city &&
//       volunteer.skills.some(skill => event.requiredSkills.includes(skill))
//     );

//     if (matchingVolunteers.length === 0) {
//       return { message: "No matching volunteers found for this event." };
//     }

//     return matchingVolunteers;
//   } catch (error) {
//     console.error('Error in getMatchingVolunteers:', error);
//     throw error;
//   }
// };



// exports.matchVolunteerToEvent = async (eventId, volunteerId) => {
//   try {
//     const event = await eventService.getEventById(eventId);
//     const volunteer = await profileService.getProfile(volunteerId);

//     if (!volunteer) {
//       throw { status: 400, message: 'Volunteer not found' };
//     }

//     if (!volunteer.availability.includes(event.eventDate)) {
//       throw { status: 400, message: 'Volunteer is not available on the event date' };
//     }

//     if (volunteer.city !== event.city) {
//       throw { status: 400, message: 'Volunteer is not in the same city as the event' };
//     }

//     if (!volunteer.skills.some(skill => event.requiredSkills.includes(skill))) {
//       throw { status: 400, message: 'Volunteer does not have the required skills for this event' };
//     }
//     return { message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` };
//   } catch (error) {
//     console.error('Error in matchVolunteerToEvent:', error);
//     throw error;
//   }
// };