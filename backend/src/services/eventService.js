const events = [
    {
      id: 1,
      eventName: "Annual Dog Walk Fundraiser",
      eventDescription: "Join us for our biggest event of the year! Walk dogs from our shelter and help raise funds for animal care.",
      location: "Hermann Park, Houston",
      requiredSkills: ["Dog walking", "Fundraising"],
      urgency: "Medium",
      eventDate: "2024-10-15",
      startTime: "09:00",
      endTime: "14:00"
    },
    {
      id: 2,
      eventName: "Emergency Supply Drive",
      eventDescription: "Urgent need for volunteers to help sort and organize donated supplies for animals affected by recent flooding.",
      location: "Community Center, 789 River Rd, Floodville, USA",
      requiredSkills: ["Organizing shelter donations", "Helping with laundry"],
      urgency: "Critical",
      eventDate: "2024-05-10",
      startTime: "07:00",
      endTime: "19:00"
    },
    {
      id: 3,
      eventName: "Pet Photography Day",
      eventDescription: "Help us update our adoption listings with new, high-quality photos of our animals. Bring your camera!",
      location: "Pawsome Adoptions, 101 Camera Lane, Shutterville, USA",
      requiredSkills: ["Taking photos of animals", "Assisting potential adopters"],
      urgency: "Medium",
      eventDate: "2024-07-22",
      startTime: "10:00",
      endTime: "15:00"
    }
];
const validateEventData = (eventData) => {
    const errors = {};
  
    if (!eventData.eventName || eventData.eventName.trim().length === 0) {
      errors.eventName = 'Event Name is required';
    } else if (eventData.eventName.length > 100) {
      errors.eventName = 'Event Name must be 100 characters or less';
    }
  
    if (!eventData.eventDescription || eventData.eventDescription.trim().length === 0) {
      errors.eventDescription = 'Event Description is required';
    }
  
    if (!eventData.location || eventData.location.trim().length === 0) {
      errors.location = 'Location is required';
    }
  
    if (!eventData.requiredSkills || eventData.requiredSkills.length === 0) {
      errors.requiredSkills = 'At least one skill is required';
    }
  
    if (!eventData.urgency) {
      errors.urgency = 'Urgency is required';
    }
  
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