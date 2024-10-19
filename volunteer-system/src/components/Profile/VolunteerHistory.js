import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/VolunteerHistory.css';

const VolunteerHistory = () => {
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchVolunteers = async () => {
          try {
              const response = await axios.get('/api/auth/volunteers');
              setVolunteers(response.data);
          } catch (error) {
              console.error('Error fetching volunteers:', error);
          }
      };

      fetchVolunteers();
  }, []);

  const fetchVolunteerHistory = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteerHistory(response.data);
    } catch (err) {
      console.error('Error fetching volunteer history:', err);
      setError('Failed to fetch volunteer history. Please try again later.');
      setVolunteerHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVolunteerChange = (e) => {
    const userId = e.target.value;
    setSelectedVolunteer(userId);
    if (userId) {
      fetchVolunteerHistory(userId);
    } else {
      setVolunteerHistory([]);
    }
  };

  return (
    <div className="volunteer-history-container">
      <h2>Volunteer Participation History</h2>

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
              {volunteer.name || volunteer.email}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {selectedVolunteer && !loading && !error && (
        <table className="volunteer-history-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Event Description</th>
              <th>Location</th>
              <th>Required Skills</th>
              <th>Urgency</th>
              <th>Event Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Participation Status</th>
            </tr>
          </thead>
          <tbody>
            {volunteerHistory.length > 0 ? (
              volunteerHistory.map((history) => (
                <tr key={history.id}>
                  <td>{history.eventName}</td>
                  <td>{history.eventDescription}</td>
                  <td>{history.location}</td>
                  <td>{history.requiredSkills.join(', ')}</td>
                  <td>{history.urgency}</td>
                  <td>{history.eventDate}</td>
                  <td>{history.startTime}</td>
                  <td>{history.endTime}</td>
                  <td>{history.participationStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No history available for this volunteer</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {!selectedVolunteer && !loading && !error && (
        <p>Please select a volunteer to view their participation history.</p>
      )}
    </div>
  );
};

export default VolunteerHistory;