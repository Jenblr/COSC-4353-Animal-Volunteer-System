import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import '../../styles/MatchingForm.css';

const VolunteerMatching = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [matchingVolunteers, setMatchingVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [message, setMessage] = useState('');

  //fetch all events on component mount
  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log('Fetching events...'); 
        const response = await api.get('/events');
        setEvents(response.data); 
      } catch (error) {
        console.error('Error fetching events:', error.response ? error.response.data : error); 
        setMessage('Error fetching events');
      }
    }
    fetchEvents();
  }, []);

  //fetch matching volunteers when 'Search Volunteers' button is clicked
  const searchVolunteers = async () => {
    if (!selectedEvent) {
      setMessage('Please select an event');
      return;
    }
    
    try {
      const response = await api.get(`/volunteer-matching/${selectedEvent}`);
      if (response.data.message) {
        setMessage(response.data.message);
        setMatchingVolunteers([]); 
      } else {
        setMatchingVolunteers(response.data); 
        setMessage('');
      }
    } catch (error) {
      console.error('Error fetching matching volunteers:', error); 
      setMessage('Error fetching matching volunteers');
    }
  };

  //handle the selection of volunteers
  const handleVolunteerSelection = (volunteerId) => {
    setSelectedVolunteers((prev) => {
      if (prev.includes(volunteerId)) {
        return prev.filter(id => id !== volunteerId); 
      } else {
        return [...prev, volunteerId]; 
      }
    });
  };

  //match selected volunteers to the event
  const matchVolunteers = async () => {
    if (selectedVolunteers.length === 0) {
      setMessage('No volunteers selected for matching');
      return;
    }
  
    try {
      const response = await api.post('/volunteer-matching', {
        eventId: selectedEvent,
        volunteerIds: selectedVolunteers,
      });
      setMessage(response.data.map(r => `${r.message}`).join(', '));
    } catch (error) {
      console.error('Error matching volunteers to the event:', error);
      setMessage('Error matching volunteers to the event');
    }
  };

  return (
    <div className="volunteer-matching-form">
      <div className="form-header">
        <h2>Volunteer Matching</h2>
      </div>
      <div className="form-content">
        {message && <p className="message">{message}</p>} 

        <div className="form-group">
          <label htmlFor="event">Select Event:</label>
          <select
            id="event"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)} 
          >
            <option value="">--Select Event--</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.eventName} - {event.eventDate}
              </option>
            ))}
          </select>
          <button className="search-volunteers-btn" onClick={searchVolunteers}>
            Search Volunteers
          </button>
        </div>

        {matchingVolunteers.length > 0 && (
          <div className="volunteer-list">
            <h3>Matching Volunteers:</h3>
            <ul>
              {matchingVolunteers.map(volunteer => (
                <li key={volunteer.userId} className="volunteer-item">
                  <input
                    type="checkbox"
                    onChange={() => handleVolunteerSelection(volunteer.userId)} 
                    checked={selectedVolunteers.includes(volunteer.userId)}
                  />
                  <label>{volunteer.fullName} ({volunteer.skills.join(', ')})</label>
                </li>
              ))}
            </ul>
            <div className="submit-container">
              <button className="match-volunteers-button" onClick={matchVolunteers}>
                Match Volunteers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerMatching;