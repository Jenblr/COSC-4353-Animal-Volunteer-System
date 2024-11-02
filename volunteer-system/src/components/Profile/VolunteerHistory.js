import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/VolunteerHistory.css';

const VolunteerHistory = () => {
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();
  const participationStatuses = [
    { value: 'Not Attended', label: 'Not Attended' },
    { value: 'Matched - Pending Attendance', label: 'Matched - Pending Attendance' },
    { value: 'Attended', label: 'Attended' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/registered-volunteers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setError('Failed to fetch volunteers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteerHistory = async (userId) => {
      setLoading(true);
      setError(null);
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('No authentication token found');
          }

          console.log('Fetching history for user:', userId);
          const response = await axios.get(
              `http://localhost:5000/api/auth/history/${userId}`,
              {
                  headers: { Authorization: `Bearer ${token}` }
              }
          );

          console.log('History response:', response.data);
          setVolunteerHistory(response.data);
      } catch (err) {
          console.error('Error fetching volunteer history:', err);
          if (err.response?.status === 401 || err.response?.status === 403) {
              setError('Please log in again to view history.');
          } else {
              setError('Failed to fetch volunteer history. Please try again later.');
          }
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

  const updateEventStatus = async (historyId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/auth/history/${historyId}`, 
        { participationStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the volunteer history after updating
      fetchVolunteerHistory(selectedVolunteer);
    } catch (error) {
      console.error('Error updating event status:', error);
      setError('Failed to update event status. Please try again.');
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Matched - Pending Attendance':
        return 'status-matched';
      case 'Attended':
        return 'status-attended';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-not-attended';
    }
  };

  return (
    <div className="volunteer-history-container">
      <h2>Volunteer Participation History</h2>

      <div className="volunteer-selection">
        <label htmlFor="volunteer-dropdown">Select Volunteer: </label>
        <select
          id="volunteer-dropdown"
          value={selectedVolunteer}
          onChange={handleVolunteerChange}
        >
          <option value="">-- Select Volunteer --</option>
          {volunteers.map((volunteer) => (
            <option key={volunteer.id} value={volunteer.id}>
              {volunteer.fullName || volunteer.email}
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
              {isAdmin && <th>Actions</th>}
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
                  <td className={getStatusClassName(history.participationStatus)}>
                    {history.participationStatus}
                  </td>
                  {isAdmin && (
                    <td>
                      <select
                        value={history.participationStatus}
                        onChange={(e) => updateEventStatus(history.id, e.target.value)}
                        className={getStatusClassName(history.participationStatus)}
                      >
                        {participationStatuses.map(status => (
                          <option 
                            key={status.value} 
                            value={status.value}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 10 : 9}>No history available for this volunteer</td>
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