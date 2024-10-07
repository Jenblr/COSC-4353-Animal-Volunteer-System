// middleware/validateEventInput.js

//helper function to validate date string (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date.toISOString().slice(0, 10) === dateString;
  }
  
  //helper function to validate time string (HH:MM)
  function isValidTime(timeString) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeString);
  }
  
const validateEventInput = (req, res, next) => {
    const { eventName, eventDescription, location, requiredSkills, urgency, eventDate, startTime, endTime } = req.body;
    const errors = {};
  
    //validate eventName
    if (!eventName || typeof eventName !== 'string' || eventName.trim().length === 0) {
      errors.eventName = 'Event Name is required';
    } else if (eventName.length > 100) {
      errors.eventName = 'Event Name must be 100 characters or less';
    }
  
    //validate eventDescription
    if (!eventDescription || typeof eventDescription !== 'string' || eventDescription.trim().length === 0) {
      errors.eventDescription = 'Event Description is required';
    }
  
    //validate location
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      errors.location = 'Location is required';
    }
  
    //validate requiredSkills
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      errors.requiredSkills = 'At least one skill is required';
    }
  
    //validate urgency
    const validUrgencyLevels = ['Low', 'Medium', 'High', 'Critical'];
    if (!urgency || !validUrgencyLevels.includes(urgency)) {
      errors.urgency = 'Valid urgency level is required';
    }
  
    //validate eventDate
    if (!eventDate || !isValidDate(eventDate)) {
      errors.eventDate = 'Valid event date is required';
    }
  
    //validate startTime and endTime
    if (!startTime || !isValidTime(startTime)) {
      errors.startTime = 'Valid start time is required';
    }
    if (!endTime || !isValidTime(endTime)) {
      errors.endTime = 'Valid end time is required';
    }
    if (startTime && endTime && startTime >= endTime) {
      errors.endTime = 'End time must be after start time';
    }
  
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
  
    next();
  };
  

module.exports = { validateEventInput };