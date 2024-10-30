const volunteerHistoryService = require('../services/historyService');
const authService = require('../services/authService'); 

const events = [
  {
    id: '1',
    eventName: 'Animal Shelter Cleanup',
    eventDescription: 'Help clean and organize the animal shelter.',
    address1: '123 Shelter Lane',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    requiredSkills: ['Cleaning', 'Animal Care'],
    urgency: 'Medium',
    eventDate: '2024-06-15',
    startTime: '09:00',
    endTime: '14:00',
  },
  {
    id: '2',
    eventName: 'Dog Walking Day',
    eventDescription: 'Volunteers needed to walk dogs from the shelter.',
    address1: '456 Park Avenue',
    city: 'Dogville',
    state: 'NY',
    zipCode: '67890',
    requiredSkills: ['Dog Walking','Animal care'],
    urgency: 'Low',
    eventDate: '2024-07-01',
    startTime: '10:00',
    endTime: '12:00',
  },
  {
    id: '3',
    eventName: 'Emergency Vet Assistance',
    eventDescription: 'Assist veterinarians with emergency cases.',
    address1: '789 Vet Clinic Road',
    city: 'Petsburg',
    state: 'TX',
    zipCode: '54321',
    requiredSkills: ['Medication', 'Emergency Response'],
    urgency: 'High',
    eventDate: '2024-06-30',
    startTime: '08:00',
    endTime: '20:00',
  }
];

const validateEventData = (eventData) => {
  const errors = {};

  //validate eventName
  if (!eventData.eventName || eventData.eventName.trim().length === 0) {
    errors.eventName = 'Event Name is required';
  } else if (eventData.eventName.length > 100) {
    errors.eventName = 'Event Name must be 100 characters or less';
  }

  //validate eventDescription
  if (!eventData.eventDescription || eventData.eventDescription.trim().length === 0) {
    errors.eventDescription = 'Event Description is required';
  }

  //validate address1
  if (!eventData.address1 || eventData.address1.trim().length === 0) {
    errors.address1 = 'Address 1 is required';
  }

  //validate city
  if (!eventData.city || eventData.city.trim().length === 0) {
    errors.city = 'City is required';
  }

  //validate state
  if (!eventData.state || eventData.state.trim().length === 0) {
    errors.state = 'State is required';
  }

  //validate zipCode
  if (!eventData.zipCode || eventData.zipCode.trim().length === 0) {
    errors.zipCode = 'Zip Code is required';
  }

  //validate requiredSkills
  if (!eventData.requiredSkills || eventData.requiredSkills.length === 0) {
    errors.requiredSkills = 'At least one skill is required';
  }

  //validate urgency
  if (!eventData.urgency) {
    errors.urgency = 'Urgency is required';
  }

  //validate eventDate
  if (!eventData.eventDate) {
    errors.eventDate = 'Event Date is required';
  }

  return errors;
};

exports.createEvent = (eventData) => {
  const errors = validateEventData(eventData);
  if (Object.keys(errors).length > 0) {
    throw { status: 400, errors };
  }

  // Convert ID to string to match existing event format
  const newEvent = {
    id: (events.length + 1).toString(), // Convert to string to match existing events
    ...eventData,
    createdAt: new Date().toISOString()
  };
  
  events.push(newEvent);

  // Pull volunteers' info and add each event to their history
  const allVolunteers = authService.getAllVolunteers();
  allVolunteers.forEach(volunteer => {
    const historyRecord = {
      eventId: newEvent.id, // This will now be a string
      eventName: newEvent.eventName,
      eventDescription: newEvent.eventDescription,
      location: `${newEvent.address1}, ${newEvent.city}, ${newEvent.state} ${newEvent.zipCode}`,
      requiredSkills: newEvent.requiredSkills,
      urgency: newEvent.urgency,
      eventDate: newEvent.eventDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      participationStatus: 'Not Attended'
    };

    volunteerHistoryService.updateHistoryRecord(volunteer.id, historyRecord);
  });

  return {
    message: "Event created successfully",
    event: newEvent
  };
};

exports.getAllEvents = () => {
  return events;
};

exports.getEventById = (id) => {
  console.log('Looking for event with ID:', id);
  
  const event = events.find(e => e.id === id.toString());
  
  if (!event) {
    console.log('No event found with ID:', id);
    throw { status: 404, message: 'Event not found' };
  }
  
  console.log('Found event:', event);
  return event;
};

exports.updateEvent = (id, eventData) => {
  // Compare the event id as a string to match the stored event IDs
  const index = events.findIndex(e => e.id === String(id));
  if (index === -1) {
    throw { status: 404, message: 'Event not found' };
  }

  const errors = validateEventData(eventData);
  if (Object.keys(errors).length > 0) {
    throw { status: 400, errors };
  }

  const updatedEvent = { ...events[index], ...eventData, updatedAt: new Date().toISOString() };
  events[index] = updatedEvent;
  return {
    message: "Event updated successfully",
    event: updatedEvent
  };
};

exports.deleteEvent = (id) => {
  // Compare the event id as a string to match the stored event IDs
  const index = events.findIndex(e => e.id === String(id));
  if (index === -1) {
    throw { status: 404, message: 'Event not found' };
  }
  events.splice(index, 1);
  return { message: "Event deleted successfully" };
};

exports.getFormOptions = () => {
  return {
    skillOptions: [
      'Animal Care',
      'Assisting Potential Adopters',
      'Cleaning',
      'Dog Walking',
      'Emergency Response',
      'Event Coordination',
      'Exercise',
      'Feeding',
      'Grooming',
      'Helping with Laundry',
      'Medication',
      'Organizing Shelter Donations',
      'Potty and Leash Training',
      'Taking Photos of Animals',
      'Temporary Foster Care'
    ],
    urgencyOptions: ['Low', 'Medium', 'High', 'Critical'],
    stateOptions: [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]
  };
};