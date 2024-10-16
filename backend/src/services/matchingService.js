//matchingService.js

const eventService = require('./eventService');

//sample volunteer data
const volunteers = [
  {
    userId: '1',
    fullName: 'John Doe',
    address1: '123 Main St',
    address2: 'Apt 4B',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    skills: ['Animal Care', 'Feeding'],
    preferences: 'Prefer working with dogs',
    availability: ['2024-06-01', '2024-06-15', '2024-06-30']
  },
  {
    userId: '2',
    fullName: 'Jane Smith',
    address1: '456 Elm St',
    address2: '',
    city: 'Houston',
    state: 'TX',
    zipCode: '67890',
    skills: ['Grooming', 'Medication Administration', 'Cleaning'],
    preferences: 'Available on weekends',
    availability: ['2024-10-15', '2024-07-15', '2024-07-30']
  }
];

exports.getMatchingVolunteers = async (eventId) => {
    const event = await eventService.getEventById(eventId);
  
    const matchingVolunteers = volunteers.filter(volunteer => 
      volunteer.availability.includes(event.eventDate) &&
      volunteer.city === event.city &&
      volunteer.skills.some(skill => event.requiredSkills.includes(skill))
    );
  
    if (matchingVolunteers.length === 0) {
      return { message: "No matching volunteers found for this event." };
    }
  
    return matchingVolunteers;
  };

exports.matchVolunteerToEvent = async (eventId, volunteerId) => {
  const event = await eventService.getEventById(eventId);
  const volunteer = volunteers.find(v => v.userId === volunteerId);

  if (!volunteer) {
    throw { status: 400, message: 'Volunteer not found' };
  }

  if (!volunteer.availability.includes(event.eventDate)) {
    throw { status: 400, message: 'Volunteer is not available on the event date' };
  }

  if (volunteer.city !== event.city) {
    throw { status: 400, message: 'Volunteer is not in the same city as the event' };
  }

  if (!volunteer.skills.some(skill => event.requiredSkills.includes(skill))) {
    throw { status: 400, message: 'Volunteer does not have the required skills for this event' };
  }

  //update the database here
  //return a success message
  return { message: `Volunteer ${volunteer.fullName} successfully matched to event ${event.eventName}` };
};