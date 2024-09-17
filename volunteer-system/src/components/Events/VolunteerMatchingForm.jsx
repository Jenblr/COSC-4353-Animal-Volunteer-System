// import React from 'react'

// const VolunteerMatchingForm = () => {
//   return (
//     <div>VolunteerMatchingForm</div>
//   )
// }

// export default VolunteerMatchingForm

import '../../styles/MatchingForm.css';

import React, { useState, useEffect, useMemo } from 'react';


const VolunteerMatchingForm = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [matchedVolunteers, setMatchedVolunteers] = useState([]);

  const events = useMemo(() => [
    {
      name: "Vaccination",
      date: "23 Sep 2024",
      time: "9:00 am - 12:00 pm",
      skills: ["special care", "medication"],
      urgency: "high"
    },
    {
      name: "Adoption Day",
      date: "24 Sep 2024",
      time: "2:00 pm - 4:00 pm",
      skills: ["communication", "cleaning", "animal care"],
      urgency: "low"
    },
    {
      name: "Pet Therapy",
      date: "1 Oct 2024",
      time: "10:00 am - 12:00 pm",
      skills: ["supervising", "time-management", "interacting with people"],
      urgency: "medium"
    }
  ], []);

  const volunteers = useMemo(() => [
    {
      name: "Claire Smith",
      availableDates: ["24 Sep 2024", "2 Oct 2024"],
      availableTime: "10:00 am - 4:00 pm",
      skills: ["communication", "animal care"]
    },
    {
      name: "Adam Larson",
      availableDates: ["23 Sep 2024", "5 Oct 2024"],
      availableTime: "10:00 am - 5:00 pm",
      skills: ["special care", "medication"]
    },
    {
      name: "Mara Kelly",
      availableDates: ["1 Oct 2024", "5 Oct 2024"],
      availableTime: "10:00 am - 4:00 pm",
      skills: ["supervising", "time-management"]
    }
  ], []);

  useEffect(() => {
    if (selectedEvent) {
      const event = events.find(e => e.name === selectedEvent);
      const matching = volunteers.filter(volunteer => 
        volunteer.availableDates.includes(event.date) &&
        volunteer.skills.some(skill => event.skills.includes(skill))
      );
      setMatchedVolunteers(matching);
    } else {
      setMatchedVolunteers([]);
    }
  }, [selectedEvent, events, volunteers]);

  const handleEventSearch = (e) => {
    setEventSearch(e.target.value);
    const event = events.find(event => event.name.toLowerCase().includes(e.target.value.toLowerCase()));
    if (event) {
      setSelectedEvent(event.name);
    } else {
      setSelectedEvent('');
    }
  };

  const handleVolunteerSearch = (e) => {
    setVolunteerSearch(e.target.value);
    const volunteer = matchedVolunteers.find(vol => vol.name.toLowerCase().includes(e.target.value.toLowerCase()));
    if (volunteer) {
      setSelectedVolunteer(volunteer.name);
    } else {
      setSelectedVolunteer('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEvent && selectedVolunteer) {
      alert(`Matched: ${selectedVolunteer} to ${selectedEvent}`);
    } else {
      alert('Please select both an event and a volunteer.');
    }
  };

  return (
    <div className="volunteer-matching-form">
      <div className="form-header">
        <h2>Volunteer Matching</h2>
      </div>
      <div className="form-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventSearch">Search Event:</label>
            <input
              type="text"
              id="eventSearch"
              value={eventSearch}
              onChange={handleEventSearch}
              list="eventList"
              placeholder="Start typing event name..."
            />
            <datalist id="eventList">
              {events.map((event, index) => (
                <option key={index} value={event.name} />
              ))}
            </datalist>
          </div>
          
          {selectedEvent && (
            <div className="form-group">
              <label htmlFor="volunteerSearch">Search Matching Volunteer:</label>
              <input
                type="text"
                id="volunteerSearch"
                value={volunteerSearch}
                onChange={handleVolunteerSearch}
                list="volunteerList"
                placeholder="Start typing volunteer name..."
              />
              <datalist id="volunteerList">
                {matchedVolunteers.map((volunteer, index) => (
                  <option key={index} value={volunteer.name} />
                ))}
              </datalist>
            </div>
          )}
          
          {selectedEvent && selectedVolunteer && (
            <div className="event-details">
              <h3>Event Details:</h3>
              <p><strong>Event:</strong> {selectedEvent}</p>
              <p><strong>Date:</strong> {events.find(e => e.name === selectedEvent).date}</p>
              <p><strong>Time:</strong> {events.find(e => e.name === selectedEvent).time}</p>
              <p><strong>Skills Required:</strong> {events.find(e => e.name === selectedEvent).skills.join(', ')}</p>
              <p><strong>Urgency:</strong> {events.find(e => e.name === selectedEvent).urgency}</p>
            </div>
          )}

          <div className="submit-container">
            <button type="submit">Match Volunteer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VolunteerMatchingForm;