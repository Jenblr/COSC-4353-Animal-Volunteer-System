import React, { useState, useEffect } from 'react';
import api from '../../utils/api';  
import '../../styles/Events.css';  

const EventManagementForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    requiredSkills: [],
    urgency: '',
    eventDate: '',
    startTime: '',
    endTime: ''
  });
  const [errors, setErrors] = useState({});
  const [formOptions, setFormOptions] = useState({
    skillOptions: [],
    urgencyOptions: [],
    stateOptions: []
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchFormOptions();
  }, []);

  const fetchFormOptions = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get('/events/form-options');
      setFormOptions(response.data);
    } catch (error) {
      console.error('Error fetching form options:', error.response?.data || error.message);
      setErrorMessage('Unable to load form options. Please try again later.');
      setFormOptions({
        skillOptions: [],
        urgencyOptions: [],
        stateOptions: []
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSkillsChange = (skill) => {
    setFormData(prevState => ({
      ...prevState,
      requiredSkills: prevState.requiredSkills.includes(skill)
        ? prevState.requiredSkills.filter(s => s !== skill)
        : [...prevState.requiredSkills, skill]
    }));
    if (errors.requiredSkills) {
      setErrors(prevErrors => ({ ...prevErrors, requiredSkills: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventName.trim()) newErrors.eventName = 'Event Name is required';
    if (!formData.eventDescription.trim()) newErrors.eventDescription = 'Event Description is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip Code is required';
    if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
    if (!formData.urgency) newErrors.urgency = 'Urgency is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start Time is required';
    if (!formData.endTime) newErrors.endTime = 'End Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await api.post('/events', formData);
      setSubmitStatus('success');
   
      setFormData({
        eventName: '',
        eventDescription: '',
        address1: '',
        city: '',
        state: '',
        zipCode: '',
        requiredSkills: [],
        urgency: '',
        eventDate: '',
        startTime: '',
        endTime: ''
      });
      console.log('Event created successfully:', response.data);
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      setErrors(error.response?.data?.errors || {});
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return (
      <div className="error-message">
        <p>{errorMessage}</p>
        <button onClick={fetchFormOptions}>Retry</button>
      </div>
    );
  }

  return (
    <div className="event-management-form">
      <h2>Event Management Form</h2>
      {submitStatus === 'success' && <div className="success-message">Event created successfully!</div>}
      {submitStatus === 'error' && <div className="error-message">Error creating event. Please try again.</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
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
          <label htmlFor="address1">Address:</label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
          />
          {errors.address1 && <span className="error">{errors.address1}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state">State:</label>
          <select
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {formOptions.stateOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.state && <span className="error">{errors.state}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code:</label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
          {errors.zipCode && <span className="error">{errors.zipCode}</span>}
        </div>

        <div className="form-group">
          <label>Required Skills:</label>
          <div className="multi-select-container">
            <div className="multi-select-header" onClick={() => setIsSkillsOpen(!isSkillsOpen)}>
              <span>{formData.requiredSkills.length ? formData.requiredSkills.join(', ') : 'Select skills'}</span>
              <span className="arrow">{isSkillsOpen ? '▲' : '▼'}</span>
            </div>
            {isSkillsOpen && (
              <div className="multi-select-options">
                {formOptions.skillOptions.map(option => (
                  <label key={option} className="multi-select-option">
                    <input
                      type="checkbox"
                      checked={formData.requiredSkills.includes(option)}
                      onChange={() => handleSkillsChange(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
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
            {formOptions.urgencyOptions.map(option => (
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

        <div className="form-group">
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

        <div className="form-group">
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default EventManagementForm;

//**frontend without backend integration */
// import React, { useState } from 'react';
// import './Events.css';

// const MultiSelect = ({ options, selected, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleOption = (option) => {
//     const updatedSelection = selected.includes(option)
//       ? selected.filter(item => item !== option)
//       : [...selected, option];
//     onChange(updatedSelection);
//   };
  
//   return (
//     <div className="multi-select-container">
//       <div className="multi-select-header" onClick={() => setIsOpen(!isOpen)}>
//         <span>{selected.length ? selected.join(', ') : 'Select skills'}</span>
//         <span className="arrow">{isOpen ? '▲' : '▼'}</span>
//       </div>
//       {isOpen && (
//         <div className="multi-select-options">
//           {options.map(option => (
//             <label key={option} className="multi-select-option">
//               <input
//                 type="checkbox"
//                 checked={selected.includes(option)}
//                 onChange={() => toggleOption(option)}
//               />
//               {option}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const EventManagementForm = () => {
//   const [formData, setFormData] = useState({
//     eventName: '',
//     eventDescription: '',
//     address1: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     requiredSkills: [],
//     urgency: '',
//     eventDate: '',
//     startTime: '',
//     endTime: ''
//   });
//   const [errors, setErrors] = useState({});

//   const skillOptions = [
//     'Dog walking',
//     'Taking photos of animals',
//     'Organizing shelter donations',
//     'Helping with laundry',
//     'Cleaning',
//     'Medication',
//     'Grooming',
//     'Assisting potential adopters'
//   ];

//   const stateOptions = [
//     'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
//     'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
//     'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
//     'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
//     'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
//   ];

//   const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//     }
//   };

//   const handleSkillsChange = (selectedSkills) => {
//     setFormData(prevState => ({
//       ...prevState,
//       requiredSkills: selectedSkills
//     }));
//     if (errors.requiredSkills) {
//       setErrors(prevErrors => ({ ...prevErrors, requiredSkills: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.eventName.trim()) {
//       newErrors.eventName = 'Event Name is required';
//     } else if (formData.eventName.length > 100) {
//       newErrors.eventName = 'Event Name must be 100 characters or less';
//     }

//     if (!formData.eventDescription.trim()) {
//       newErrors.eventDescription = 'Event Description is required';
//     }

//     if (!formData.address1.trim()) {
//       newErrors.address1 = 'Address 1 is required';
//     } else if (formData.address1.length > 100) {
//       newErrors.address1 = 'Address 1 must be 100 characters or less';
//     }

//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     } else if (formData.city.length > 100) {
//       newErrors.city = 'City must be 100 characters or less';
//     }

//     if (!formData.state) {
//       newErrors.state = 'State is required';
//     }

//     if (!formData.zipCode.trim()) {
//       newErrors.zipCode = 'Zip Code is required';
//     } else if (formData.zipCode.length < 5 || formData.zipCode.length > 9) {
//       newErrors.zipCode = 'Zip Code must be between 5 and 9 characters';
//     }

//     if (formData.requiredSkills.length === 0) {
//       newErrors.requiredSkills = 'At least one skill is required';
//     }

//     if (!formData.urgency) {
//       newErrors.urgency = 'Urgency is required';
//     }

//     if (!formData.eventDate) {
//       newErrors.eventDate = 'Event Date is required';
//     }

//     if (!formData.startTime) {
//       newErrors.startTime = 'Start Time is required';
//     }

//     if (!formData.endTime) {
//       newErrors.endTime = 'End Time is required';
//     }

//     if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
//       newErrors.endTime = 'End Time must be after Start Time';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       console.log('Form submitted:', formData);
//     }
//   };

//   return (
//     <div className="event-management-form">
//       <div className="form-header">
//         <h2>Event Management Form</h2>
//       </div>
//       <div className="form-content">
//         <form onSubmit={handleSubmit}>
//           {/* Existing fields */}
//           <div className="form-group">
//             <label htmlFor="eventName">Event Name:</label>
//             <input
//               type="text"
//               id="eventName"
//               name="eventName"
//               value={formData.eventName}
//               onChange={handleChange}
//               maxLength="100"
//             />
//             {errors.eventName && <span className="error">{errors.eventName}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="eventDescription">Event Description:</label>
//             <textarea
//               id="eventDescription"
//               name="eventDescription"
//               value={formData.eventDescription}
//               onChange={handleChange}
//             />
//             {errors.eventDescription && <span className="error">{errors.eventDescription}</span>}
//           </div>

//           {/* New address fields */}
//           <div className="form-group">
//             <label htmlFor="address1">Address 1:</label>
//             <input
//               type="text"
//               id="address1"
//               name="address1"
//               value={formData.address1}
//               onChange={handleChange}
//               maxLength="100"
//             />
//             {errors.address1 && <span className="error">{errors.address1}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="city">City:</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               maxLength="100"
//             />
//             {errors.city && <span className="error">{errors.city}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="state">State:</label>
//             <select
//               id="state"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//             >
//               <option value="">Select State</option>
//               {stateOptions.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//             {errors.state && <span className="error">{errors.state}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="zipCode">Zip Code:</label>
//             <input
//               type="text"
//               id="zipCode"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               maxLength="9"
//             />
//             {errors.zipCode && <span className="error">{errors.zipCode}</span>}
//           </div>

//           {/* Remaining fields */}
//           <div className="form-group">
//             <label>Required Skills:</label>
//             <MultiSelect
//               options={skillOptions}
//               selected={formData.requiredSkills}
//               onChange={handleSkillsChange}
//             />
//             {errors.requiredSkills && <span className="error">{errors.requiredSkills}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="urgency">Urgency:</label>
//             <select
//               id="urgency"
//               name="urgency"
//               value={formData.urgency}
//               onChange={handleChange}
//             >
//               <option value="">Select Urgency</option>
//               {urgencyOptions.map(option => (
//                 <option key={option} value={option}>{option}</option>
//               ))}
//             </select>
//             {errors.urgency && <span className="error">{errors.urgency}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="eventDate">Event Date:</label>
//             <input
//               type="date"
//               id="eventDate"
//               name="eventDate"
//               value={formData.eventDate}
//               onChange={handleChange}
//             />
//             {errors.eventDate && <span className="error">{errors.eventDate}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="startTime">Start Time:</label>
//             <input
//               type="time"
//               id="startTime"
//               name="startTime"
//               value={formData.startTime}
//               onChange={handleChange}
//             />
//             {errors.startTime && <span className="error">{errors.startTime}</span>}
//           </div>

//           <div className="form-group">
//             <label htmlFor="endTime">End Time:</label>
//             <input
//               type="time"
//               id="endTime"
//               name="endTime"
//               value={formData.endTime}
//               onChange={handleChange}
//             />
//             {errors.endTime && <span className="error">{errors.endTime}</span>}
//           </div>

//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EventManagementForm;
