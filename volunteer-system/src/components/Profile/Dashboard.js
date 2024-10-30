import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const states = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
    { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
  ];

  const skillOptions = [
    { value: 'Animal Care', label: 'Animal Care' },
    { value: 'Feeding', label: 'Feeding' },
    { value: 'Exercise', label: 'Exercise' },
    { value: 'Medication Administration', label: 'Medication Administration' },
    { value: 'Grooming', label: 'Grooming' },
    { value: 'Potty and Leash Training', label: 'Potty and Leash Training' },
    { value: 'Event Coordination', label: 'Event Coordination' },
    { value: 'Temporary Foster Care', label: 'Temporary Foster Care' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData({
          ...response.data,
          availability: response.data.availability.map(date => new Date(date))
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map(option => option.value);
    setUserData({ ...userData, skills: selectedSkills });
  };

  const handleDateChange = (date) => {
    setUserData({ 
      ...userData, 
      availability: [...userData.availability, date]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/profile', {
        ...userData,
        availability: userData.availability.map(date => date.toISOString())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      // Optionally, show a success message to the user
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={userData.fullName}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.fullName}</span>
          )}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <span>{userData.email}</span>
        </div>

        <div className="form-group">
          <label>Address 1:</label>
          {isEditing ? (
            <input
              type="text"
              name="address1"
              value={userData.address1}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.address1}</span>
          )}
        </div>

        <div className="form-group">
          <label>Address 2:</label>
          {isEditing ? (
            <input
              type="text"
              name="address2"
              value={userData.address2}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.address2}</span>
          )}
        </div>

        <div className="form-group">
          <label>City:</label>
          {isEditing ? (
            <input
              type="text"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.city}</span>
          )}
        </div>

        <div className="form-group">
          <label>State:</label>
          {isEditing ? (
            <Select
              options={states}
              value={states.find(state => state.value === userData.state)}
              onChange={(selectedOption) => setUserData({ ...userData, state: selectedOption.value })}
            />
          ) : (
            <span>{userData.state}</span>
          )}
        </div>

        <div className="form-group">
          <label>Zip Code:</label>
          {isEditing ? (
            <input
              type="text"
              name="zipCode"
              value={userData.zipCode}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.zipCode}</span>
          )}
        </div>

        <div className="form-group">
          <label>Skills:</label>
          {isEditing ? (
            <Select
              isMulti
              options={skillOptions}
              value={skillOptions.filter(option => userData.skills.includes(option.value))}
              onChange={handleSkillChange}
            />
          ) : (
            <span>{userData.skills.join(', ')}</span>
          )}
        </div>

        <div className="form-group">
          <label>Preferences:</label>
          {isEditing ? (
            <textarea
              name="preferences"
              value={userData.preferences}
              onChange={handleInputChange}
            />
          ) : (
            <span>{userData.preferences}</span>
          )}
        </div>

        <div className="form-group">
          <label>Availability:</label>
          {isEditing ? (
            <DatePicker
              selected={null}
              onChange={handleDateChange}
              minDate={new Date()}
              inline
            />
          ) : (
            <span>{userData.availability.map(date => date.toDateString()).join(', ')}</span>
          )}
        </div>

        {isEditing ? (
          <button type="submit">Save Changes</button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;