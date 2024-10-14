//eventController.js

const eventService = require('../services/eventService');

//create a new event
exports.createEvent = async (req, res) => {
  try {
    console.log('Create Event Request Body:', req.body);
    const result = await eventService.createEvent(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.status === 400) {
      res.status(400).json({ errors: error.errors || 'Bad request' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

//get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

//get a specific event by ID
exports.getEventById = async (req, res) => {
  try {
    console.log('Fetching event with ID:', req.params.id);
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    if (error.status === 404) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

//update an existing event
exports.updateEvent = async (req, res) => {
  try {
    console.log('Update Event Request ID:', req.params.id);
    console.log('Update Event Request Body:', req.body);
    const result = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating event:', error);
    if (error.status === 404) {
      res.status(404).json({ message: error.message });
    } else if (error.status === 400) {
      res.status(400).json({ errors: error.errors || 'Bad request' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

//delete an event
exports.deleteEvent = async (req, res) => {
  try {
    console.log('Delete Event Request ID:', req.params.id);
    const result = await eventService.deleteEvent(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting event:', error);
    if (error.status === 404) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};

//get form options for the event creation form
exports.getFormOptions = async (req, res) => {
  try {
    const options = await eventService.getFormOptions();
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching form options:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
