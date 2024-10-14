const events = [
  {
    id: 1,
    eventName: 'Animal Shelter Cleanup',
    eventDescription: 'Join us for a day of cleaning and organizing the animal shelter. Help us provide a clean and comfortable space for the animals.',
    address1: '1234 Paw Street',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    requiredSkills: ['Cleaning', 'Organizing shelter donations'],
    urgency: 'Medium',
    eventDate: '2024-10-15',
    startTime: '09:00',
    endTime: '12:00',
  },
  {
    id: 2,
    eventName: 'Laundry Day for the Pups',
    eventDescription: 'Help wash and fold bedding and towels to keep the animals comfortable and clean. Your help is greatly appreciated!',
    address1: '7890 Fetch Drive',
    city: 'El Paso',
    state: 'TX',
    zipCode: '79901',
    requiredSkills: ['Helping with laundry', 'Cleaning'],
    urgency: 'Medium',
    eventDate: '2024-11-10',
    startTime: '08:00',
    endTime: '12:00'
  },
  {
    id: 3,
    eventName: 'Adoption Drive',
    eventDescription: 'Help potential adopters find their new best friend. Assist with paperwork, introduce the animals, and answer questions.',
    address1: '3456 Purr Road',
    city: 'San Antonio',
    state: 'TX',
    zipCode: '78201',
    requiredSkills: ['Assisting potential adopters', 'Medication'],
    urgency: 'Critical',
    eventDate: '2024-11-01',
    startTime: '09:00',
    endTime: '17:00'
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

  const newEvent = {
    id: events.length + 1,
    ...eventData,
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  return {
    message: "Event created successfully",
    event: newEvent
  };
};

exports.getAllEvents = () => {
  return events;
};

exports.getEventById = (id) => {
  const event = events.find(e => e.id === parseInt(id));
  if (!event) {
    throw { status: 404, message: 'Event not found' };
  }
  return event;
};

exports.updateEvent = (id, eventData) => {
  const index = events.findIndex(e => e.id === parseInt(id));
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
  const index = events.findIndex(e => e.id === parseInt(id));
  if (index === -1) {
    throw { status: 404, message: 'Event not found' };
  }
  events.splice(index, 1);
  return { message: "Event deleted successfully" };
};

exports.getFormOptions = () => {
  return {
    skillOptions: [
      'Dog walking',
      'Taking photos of animals',
      'Organizing shelter donations',
      'Helping with laundry',
      'Cleaning',
      'Medication',
      'Grooming',
      'Assisting potential adopters'
    ],
    urgencyOptions: ['Low', 'Medium', 'High', 'Critical']
  };
};