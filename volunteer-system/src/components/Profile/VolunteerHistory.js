import React, { useState, useEffect } from 'react';
import '../../styles/VolunteerHistory.css';

const VolunteerHistory = () => {
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]); 
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  // Just an example of how voluteer history is displayed in our table
  useEffect(() => {
    const sampleHistory = [
      {
        volunteer: 'Adam Larson',
        eventName: 'Pet Training Workshop',
        eventDescription: 'Assist in training sessions for shelter animals',
        location: 'Special Pals Animal Shelter',
        requiredSkills: ['Animal training', 'Communication'],
        urgency: 'Medium',
        eventDate: '10-01-2024',
        participationStatus: 'Pending',
      },
      {
        volunteer: 'Claire Smith',
        eventName: 'Pet Photography Day',
        eventDescription: 'Take photos of animals for adoption profiles',
        location: 'Citizens for Animal Protection',
        requiredSkills: ['Photography', 'Animal handling'],
        urgency: 'Medium',
        eventDate: '09-22-2024',
        participationStatus: 'Confirmed',
      },
    ];

    setVolunteerHistory(sampleHistory);
  }, []);

  // Simulate fetching volunteer list 
  useEffect(() => {
    const sampleVolunteers = ['Adam Larson', 'Claire Smith', 'Mara Kelly'];
    setVolunteers(sampleVolunteers);
  }, []);

  // Handle volunteer selection
  const handleVolunteerChange = (e) => {
    setSelectedVolunteer(e.target.value);
  };

  
  const filteredHistory = volunteerHistory.filter((history) => history.volunteer === selectedVolunteer);

  return (
    <div className="volunteer-history-container">
      <h2>Volunteer Participation History</h2>

      {/* Dropdown for selecting volunteer */}
      <div className="volunteer-selection">
        <label htmlFor="volunteer-dropdown">History for: </label>
        <select
          id="volunteer-dropdown"
          value={selectedVolunteer}
          onChange={handleVolunteerChange}
        >
          <option value="">-- Select Volunteer --</option>
          {volunteers.map((volunteer, index) => (
            <option key={index} value={volunteer}>
              {volunteer}
            </option>
          ))}
        </select>
      </div>

      {selectedVolunteer && (
        <table className="volunteer-history-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Description</th>
              <th>Location</th>
              <th>Required Skills</th>
              <th>Urgency</th>
              <th>Event Date</th>
              <th>Participation Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.eventName}</td>
                  <td>{history.eventDescription}</td>
                  <td>{history.location}</td>
                  <td>{history.requiredSkills.join(', ')}</td>
                  <td>{history.urgency}</td>
                  <td>{history.eventDate}</td>
                  <td>{history.participationStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No history available for this volunteer</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Display a message if no volunteer is selected */}
      {!selectedVolunteer && (
        <p>Please select a volunteer to view their participation history.</p>
      )}
    </div>
  );
};

export default VolunteerHistory;