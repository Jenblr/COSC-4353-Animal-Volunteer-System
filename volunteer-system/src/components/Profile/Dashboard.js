import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const states = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
    // ... (include all states)
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
    // Fetch user data from API or local storage
    // This is a mock fetch, replace with actual API call
    const fetchUserData = async () => {
      // Simulating API call
      const mockUserData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        address1: '123 Main St',
        address2: 'Apt 4',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        skills: ['Animal Care', 'Feeding'],
        preferences: 'Prefer working with dogs',
        availability: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]
      };
      setUserData(mockUserData);
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map(option => option.value);
    setUserData({ ...userData, skills: selectedSkills });
  };

  const handleDateChange = (date) => {
    setUserData({ ...userData, availability: [...userData.availability, date] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the updated data to your backend
    console.log('Updated user data:', userData);
    setIsEditing(false);
    // Optionally, show a success message to the user
  };

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
    </div>
  );
};

export default Dashboard;