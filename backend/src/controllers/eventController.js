const eventService = require('../services/eventService');

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
    if (updatedEvent) {
      res.status(200).json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ errors: error.errors });
    } else {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await eventService.deleteEvent(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFormOptions = async (req, res) => {
  try {
    const options = await eventService.getFormOptions();
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching form options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
