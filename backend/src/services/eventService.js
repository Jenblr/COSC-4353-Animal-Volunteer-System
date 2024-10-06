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
    return newEvent;
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
    return updatedEvent;
  };
  
  exports.deleteEvent = (id) => {
    const index = events.findIndex(e => e.id === parseInt(id));
    if (index === -1) {
      throw { status: 404, message: 'Event not found' };
    }
    events.splice(index, 1);
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