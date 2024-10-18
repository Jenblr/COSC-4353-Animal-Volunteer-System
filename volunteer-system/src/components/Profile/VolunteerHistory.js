import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/VolunteerHistory.css';

const VolunteerHistory = () => {
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');

  // Fetch volunteer list
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/volunteers');
        setVolunteers(response.data);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();
  }, []);

  // Fetch volunteer history when a volunteer is selected
  useEffect(() => {
    if (selectedVolunteer) {
      const fetchVolunteerHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/history/${selectedVolunteer}`);
          setVolunteerHistory(response.data);
        } catch (error) {
          console.error('Error fetching volunteer history:', error);
        }
      };

      fetchVolunteerHistory();
    }
  }, [selectedVolunteer]);

  // Handle volunteer selection
  const handleVolunteerChange = (e) => {
    setSelectedVolunteer(e.target.value);
  };

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
          {volunteers.map((volunteer) => (
            <option key={volunteer.id} value={volunteer.id}>
              {volunteer.name}
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
            {volunteerHistory.length > 0 ? (
              volunteerHistory.map((history, index) => (
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