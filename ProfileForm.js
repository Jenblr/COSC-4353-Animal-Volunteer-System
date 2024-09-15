import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './ProfileForm.css';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [],
    preferences: '',
    availability: []
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const states = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
  ];

  const skillOptions = [
    { value: 'Animal Care', label: 'Animal Care' },
    { value: 'Feeding', label: 'Feeding' },
    { value: 'Exercise', label: 'Exercise' },
    { value: 'Animal Companionship', label: 'Animal Companionship' },
    { value: 'Medication Administration', label: 'Medication Administration' },
    { value: 'Grooming', label: 'Grooming' },
    { value: 'Potty and Leash Training', label: 'Potty and Leash Training' },
    { value: 'Event Coordination', label: 'Event Coordination' },
    { value: 'Temporary Foster Care', label: 'Temporary Foster Care' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillChange = (selectedOptions) => {
    const selectedSkills = selectedOptions.map(option => option.value);
    setFormData({ ...formData, skills: selectedSkills });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, availability: [...formData.availability, date] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.length > 50) newErrors.fullName = 'Full Name is required and must be 50 characters or less';
    if (!formData.address1.trim() || formData.address1.length > 100) newErrors.address1 = 'Address 1 is required and must be 100 characters or less';
    if (formData.address2.length > 100) newErrors.address2 = 'Address 2 must be 100 characters or less';
    if (!formData.city.trim() || formData.city.length > 100) newErrors.city = 'City is required and must be 100 characters or less';
    if (!formData.state) newErrors.state = 'State selection is required';
    if (!formData.zipCode.trim() || formData.zipCode.length < 5 || formData.zipCode.length > 9) newErrors.zipCode = 'Zip code must be between 5 and 9 characters';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill must be selected';
    if (formData.availability.length === 0) newErrors.availability = 'At least one date must be selected for availability';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log('Profile submission:', formData);
      navigate('/dashboard');
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="profile-form-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>Complete Your Profile</h2>

        <div className="form-group">
          <label htmlFor="skills">Skills:</label>
          <Select
            isMulti
            name="skills"
            options={skillOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSkillChange}
          />
          {errors.skills && <span className="error-message">{errors.skills}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="preferences">Preferences (optional):</label>
          <textarea
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleInputChange}
            className="preferences-textarea"
            rows="4"
            placeholder="Type any preferences you have..."
          />
        </div>

        <div className="form-group">
          <label>Availability:</label>
          <DatePicker
            selected={null}
            onChange={handleDateChange}
            minDate={new Date()}
            inline
          />
          <div className="selected-dates">
            {formData.availability.map((date, index) => (
              <span key={index} className="date-tag">{date.toDateString()}</span>
            ))}
          </div>
          {errors.availability && <span className="error-message">{errors.availability}</span>}
        </div>

        <button type="submit" className="submit-button">Complete Profile</button>
      </form>
    </div>
  );
};

export default ProfileForm;
