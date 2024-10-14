//matchingController.js

const volunteerMatchingService = require('../services/matchingService');

exports.getMatchingVolunteers = async (req, res) => {
    try {
      const { eventId } = req.params;
      const result = await volunteerMatchingService.getMatchingVolunteers(eventId);
      
      if ('message' in result) {
        //no matching volunteers found
        return res.status(404).json(result);
      }
      
      //matching volunteers found
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching matching volunteers:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

exports.matchVolunteerToEvent = async (req, res) => {
  try {
    const { eventId, volunteerId } = req.body;
    const result = await volunteerMatchingService.matchVolunteerToEvent(eventId, volunteerId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error matching volunteer to event:', error);
    if (error.status === 400) {
      res.status(400).json({ errors: error.errors || 'Bad request' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};