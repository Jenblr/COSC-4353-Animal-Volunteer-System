import React, { useState } from 'react';
import './Events.css';

const MultiSelect = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(updatedSelection);
  };
  return (
    <div className="multi-select-container">
      <div className="multi-select-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.length ? selected.join(', ') : 'Select skills'}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="multi-select-options">
          {options.map(option => (
            <label key={option} className="multi-select-option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
const EventManagementForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    location: '',
    requiredSkills: [],
    urgency: '',
    eventDate: '',
    startTime: '',
    endTime: ''
  });
  const [errors, setErrors] = useState({});

  const skillOptions = [
    'Dog walking',
    'Taking photos of animals',
    'Organizing shelter donations',
    'Helping with laundry',
    'Cleaning',
    'Medication',
    'Grooming',
    'Assisting potential adopters'
  ];



  const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleSkillsChange = (selectedSkills) => {
    setFormData(prevState => ({
      ...prevState,
      requiredSkills: selectedSkills
    }));
    if (errors.requiredSkills) {
      setErrors(prevErrors => ({ ...prevErrors, requiredSkills: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventName.trim()) {
      newErrors.eventName = 'Event Name is required';
    } else if (formData.eventName.length > 100) {
      newErrors.eventName = 'Event Name must be 100 characters or less';
    }

    if (!formData.eventDescription.trim()) {
      newErrors.eventDescription = 'Event Description is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'At least one skill is required';
    }

    if (!formData.urgency) {
      newErrors.urgency = 'Urgency is required';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start Time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End Time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End Time must be after Start Time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="event-management-form">
      <div className="form-header">
        <h2>Event Management Form</h2>
      </div>
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              maxLength="100"
            />
            {errors.eventName && <span className="error">{errors.eventName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="eventDescription">Event Description:</label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              value={formData.eventDescription}
              onChange={handleChange}
            />
            {errors.eventDescription && <span className="error">{errors.eventDescription}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <textarea
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            {errors.location && <span className="error">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label>Required Skills:</label>
            <MultiSelect
              options={skillOptions}
              selected={formData.requiredSkills}
              onChange={handleSkillsChange}
            />
            {errors.requiredSkills && <span className="error">{errors.requiredSkills}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency:</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
            >
              <option value="">Select Urgency</option>
              {urgencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.urgency && <span className="error">{errors.urgency}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
            />
            {errors.eventDate && <span className="error">{errors.eventDate}</span>}
          </div>

          <div className="form-group time-slots">
            <div className="time-slot">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
              {errors.startTime && <span className="error">{errors.startTime}</span>}
            </div>
            <div className="time-slot">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
              {errors.endTime && <span className="error">{errors.endTime}</span>}
            </div>
          </div>

          <div className="submit-container">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventManagementForm;