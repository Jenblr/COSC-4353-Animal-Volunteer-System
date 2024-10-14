// import React, { useState, useEffect } from 'react';
// import '../../styles/Events.css';

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
//     location: '',
//     requiredSkills: [],
//     urgency: '',
//     eventDate: '',
//     startTime: '',
//     endTime: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [skillOptions, setSkillOptions] = useState([]);

// const [urgencyOptions, setUrgencyOptions] = useState([]);

// const [isLoading, setIsLoading] = useState(false);

// const [successMessage, setSuccessMessage] = useState('');



// useEffect(() => {

// const fetchFormOptions = async () => {

// try {

// const response = await fetch('/api/events/form-options', {

// headers: {

// 'Authorization': `Bearer ${localStorage.getItem('token')}`

// }

// });

// if (response.ok) {

// const options = await response.json();

// setSkillOptions(options.skillOptions);

// setUrgencyOptions(options.urgencyOptions);

// } else {

// console.error('Failed to fetch form options');

// }

// } catch (error) {

// console.error('Error fetching form options:', error);

// }

// };



// fetchFormOptions();

// }, []);

//   // const skillOptions = [
//   //   'Dog walking',
//   //   'Taking photos of animals',
//   //   'Organizing shelter donations',
//   //   'Helping with laundry',
//   //   'Cleaning',
//   //   'Medication',
//   //   'Grooming',
//   //   'Assisting potential adopters'
//   // ];



//   // const urgencyOptions = ['Low', 'Medium', 'High', 'Critical'];

//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormData(prevState => ({
//   //     ...prevState,
//   //     [name]: value
//   //   }));
//   //   if (errors[name]) {
//   //     setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
//   //   }
//   // };

//   const handleSkillsChange = (selectedSkills) => {
//     setFormData(prevState => ({
//       ...prevState,
//       requiredSkills: selectedSkills
//     }));
//     if (errors.requiredSkills) {
//       setErrors(prevErrors => ({ ...prevErrors, requiredSkills: '' }));
//     }
//   };
//   const resetForm = () => {

//     setFormData({
    
//     eventName: '',
    
//     eventDescription: '',
    
//     location: '',
    
//     requiredSkills: [],
    
//     urgency: '',
    
//     eventDate: '',
    
//     startTime: '',
    
//     endTime: ''
    
//     });
    
//     setErrors({});
    
//     };
    
    
    
//     const handleSubmit = async (e) => {
    
//     e.preventDefault();
    
//     setIsLoading(true);
    
//     setSuccessMessage('');
    
//     setErrors({});
    
    
    
//     try {
    
//     const response = await fetch('/api/events', {
    
//     method: 'POST',
    
//     headers: {
    
//     'Content-Type': 'application/json',
    
//     'Authorization': `Bearer ${localStorage.getItem('token')}`
    
//     },
    
//     body: JSON.stringify(formData),
    
//     });
    
    
    
//     if (!response.ok) {
    
//     const errorData = await response.json();
    
//     setErrors(errorData.errors || { general: 'An error occurred while creating the event.' });
    
//     } else {
    
//     const newEvent = await response.json();
    
//     console.log('Event created:', newEvent);
    
//     setSuccessMessage('Event created successfully!');
    
//     resetForm();
    
//     }
    
//     } catch (error) {
    
//     console.error('Error submitting form:', error);
    
//     setErrors({ general: 'An unexpected error occurred. Please try again.' });
    
//     } finally {
    
//     setIsLoading(false);
    
//     }
    
//     };

//   // const validateForm = () => {
//   //   const newErrors = {};

//   //   if (!formData.eventName.trim()) {
//   //     newErrors.eventName = 'Event Name is required';
//   //   } else if (formData.eventName.length > 100) {
//   //     newErrors.eventName = 'Event Name must be 100 characters or less';
//   //   }

//   //   if (!formData.eventDescription.trim()) {
//   //     newErrors.eventDescription = 'Event Description is required';
//   //   }

//   //   if (!formData.location.trim()) {
//   //     newErrors.location = 'Location is required';
//   //   }

//   //   if (formData.requiredSkills.length === 0) {
//   //     newErrors.requiredSkills = 'At least one skill is required';
//   //   }

//   //   if (!formData.urgency) {
//   //     newErrors.urgency = 'Urgency is required';
//   //   }

//   //   if (!formData.eventDate) {
//   //     newErrors.eventDate = 'Event Date is required';
//   //   }

//   //   if (!formData.startTime) {
//   //     newErrors.startTime = 'Start Time is required';
//   //   }

//   //   if (!formData.endTime) {
//   //     newErrors.endTime = 'End Time is required';
//   //   }

//   //   if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
//   //     newErrors.endTime = 'End Time must be after Start Time';
//   //   }

//   //   setErrors(newErrors);
//   //   return Object.keys(newErrors).length === 0;
//   // };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   if (validateForm()) {
//   //     console.log('Form submitted:', formData);
//   //   }
//   // };

//   return (
//     <div className="event-management-form">
//       <div className="form-header">
//         <h2>Event Management Form</h2>
//       </div>
//       {/* <div className="form-content"> */}
//       {successMessage && <div className="success-message">{successMessage}</div>}
//       {errors.general && <div className="error-message">{errors.general}</div>}
//         <form onSubmit={handleSubmit}>
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

//           <div className="form-group">
//             <label htmlFor="location">Location:</label>
//             <textarea
//               id="location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//             />
//             {errors.location && <span className="error">{errors.location}</span>}
//           </div>

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

//           <div className="form-group time-slots">
//             <div className="time-slot">
//               <label htmlFor="startTime">Start Time:</label>
//               <input
//                 type="time"
//                 id="startTime"
//                 name="startTime"
//                 value={formData.startTime}
//                 onChange={handleChange}
//               />
//               {errors.startTime && <span className="error">{errors.startTime}</span>}
//             </div>
//             <div className="time-slot">
//               <label htmlFor="endTime">End Time:</label>
//               <input
//                 type="time"
//                 id="endTime"
//                 name="endTime"
//                 value={formData.endTime}
//                 onChange={handleChange}
//               />
//               {errors.endTime && <span className="error">{errors.endTime}</span>}
//             </div>
//           </div>

//           <div className="submit-container">
            
//             <button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit'}    
//             </button>
//           </div>
//         </form>
//       </div>
//     // </div>
//   );
// };

// export default EventManagementForm;

// import React, { useState, useEffect } from 'react';
// import '../../styles/Events.css';

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
//   const [formOptions, setFormOptions] = useState({ skillOptions: [], urgencyOptions: [] });
//   const [submitMessage, setSubmitMessage] = useState('');

//   // Fetch form options from the backend
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const response = await fetch('/events/form-options');
//         const data = await response.json();
//         setFormOptions({
//           skillOptions: data.skillOptions,
//           urgencyOptions: data.urgencyOptions
//         });
//       } catch (error) {
//         console.error('Error fetching form options:', error);
//       }
//     };
//     fetchOptions();
//   }, []);

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
//     if (!formData.eventName.trim()) newErrors.eventName = 'Event Name is required';
//     if (!formData.eventDescription.trim()) newErrors.eventDescription = 'Event Description is required';
//     if (!formData.address1.trim()) newErrors.address1 = 'Address 1 is required';
//     if (!formData.city.trim()) newErrors.city = 'City is required';
//     if (!formData.state) newErrors.state = 'State is required';
//     if (!formData.zipCode.trim() || formData.zipCode.length < 5 || formData.zipCode.length > 9) {
//       newErrors.zipCode = 'Zip Code must be between 5 and 9 characters';
//     }
//     if (formData.requiredSkills.length === 0) newErrors.requiredSkills = 'At least one skill is required';
//     if (!formData.urgency) newErrors.urgency = 'Urgency is required';
//     if (!formData.eventDate) newErrors.eventDate = 'Event Date is required';
//     if (!formData.startTime) newErrors.startTime = 'Start Time is required';
//     if (!formData.endTime) newErrors.endTime = 'End Time is required';
//     if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
//       newErrors.endTime = 'End Time must be after Start Time';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const response = await fetch('/events', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData)
//         });

//         if (response.ok) {
//           const result = await response.json();
//           setSubmitMessage('Event created successfully!');
//         } else {
//           const errorData = await response.json();
//           setErrors(errorData.errors || {});
//           setSubmitMessage('Failed to create event.');
//         }
//       } catch (error) {
//         console.error('Error submitting form:', error);
//         setSubmitMessage('An error occurred. Please try again.');
//       }
//     }
//   };

//   return (
//     <div className="event-management-form">
//       <div className="form-header">
//         <h2>Event Management Form</h2>
//       </div>
//       <div className="form-content">
//         <form onSubmit={handleSubmit}>
//           {/* Include the same input fields as in the previous example */}
//           {/* Add your form fields here with validation */}
//           {/* Submit Button */}
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
         
//         {submitMessage && <p className="submit-message">{submitMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default EventManagementForm;
import React, { useState, useEffect } from 'react';
import '../../styles/Events.css';

const MultiSelect = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(updatedSelection);
  };
  
  return (
    <div className="multi-select-container">
      <div className="multi-select-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.length ? selected.join(', ') : 'Select skills'}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="multi-select-options">
          {options.map(option => (
            <label key={option} className="multi-select-option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
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
  const [skillOptions, setSkillOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/events/form-options', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const options = await response.json();
          setSkillOptions(options.skillOptions);
          setUrgencyOptions(options.urgencyOptions);
          setStateOptions(options.stateOptions);
        } else {
          console.error('Failed to fetch form options');
        }
      } catch (error) {
        console.error('Error fetching form options:', error);
      }
    };

    fetchFormOptions();
  }, []);

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

  const handleSkillsChange = (selectedSkills) => {
    setFormData(prevState => ({
      ...prevState,
      requiredSkills: selectedSkills
    }));
    if (errors.requiredSkills) {
      setErrors(prevErrors => ({ ...prevErrors, requiredSkills: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/auth/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'An error occurred while creating the event.' });
      } else {
        const newEvent = await response.json();
        console.log('Event created:', newEvent);
        setSuccessMessage('Event created successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
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
    setErrors({});
  };

  return (
    <div className="event-management-form">
      <div className="form-header">
        <h2>Event Management Form</h2>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="form-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            maxLength="100"
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
            maxLength="100"
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
            maxLength="100"
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
            {stateOptions.map(option => (
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
            maxLength="9"
          />
          {errors.zipCode && <span className="error">{errors.zipCode}</span>}
        </div>

        <div className="form-group">
          <label>Required Skills:</label>
          <MultiSelect
            options={skillOptions}
            selected={formData.requiredSkills}
            onChange={handleSkillsChange}
          />
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
            {urgencyOptions.map(option => (
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

        <div className="form-group time-slots">
          <div className="time-slot">
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
          <div className="time-slot">
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
        </div>

        <div className="submit-container">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventManagementForm;

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
//   const [skillOptions, setSkillOptions] = useState([]);
//   const [urgencyOptions, setUrgencyOptions] = useState([]);
//   const [stateOptions, setStateOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchFormOptions = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/auth/events/form-options', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });
//         if (response.ok) {
//           const options = await response.json();
//           setSkillOptions(options.skillOptions);
//           setUrgencyOptions(options.urgencyOptions);
//           setStateOptions(options.stateOptions || [
//             'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
//             'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
//             'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
//             'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
//             'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
//           ]);
//         } else {
//           console.error('Failed to fetch form options');
//         }
//       } catch (error) {
//         console.error('Error fetching form options:', error);
//       }
//     };

//     fetchFormOptions();
//   }, []);

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

//   const resetForm = () => {
//     setFormData({
//       eventName: '',
//       eventDescription: '',
//       address1: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       requiredSkills: [],
//       urgency: '',
//       eventDate: '',
//       startTime: '',
//       endTime: ''
//     });
//     setErrors({});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setSuccessMessage('');
//     setErrors({});

//     try {
//       const response = await fetch('http://localhost:5000/api/auth/events', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setErrors(errorData.errors || { general: 'An error occurred while creating the event.' });
//       } else {
//         const newEvent = await response.json();
//         console.log('Event created:', newEvent);
//         setSuccessMessage('Event created successfully!');
//         resetForm();
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       setErrors({ general: 'An unexpected error occurred. Please try again.' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="event-management-form">
//       <div className="form-header">
//         <h2>Event Management Form</h2>
//       </div>
//       {successMessage && <div className="success-message">{successMessage}</div>}
//       {errors.general && <div className="error-message">{errors.general}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="eventName">Event Name:</label>
//           <input
//             type="text"
//             id="eventName"
//             name="eventName"
//             value={formData.eventName}
//             onChange={handleChange}
//             maxLength="100"
//           />
//           {errors.eventName && <span className="error">{errors.eventName}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="eventDescription">Event Description:</label>
//           <textarea
//             id="eventDescription"
//             name="eventDescription"
//             value={formData.eventDescription}
//             onChange={handleChange}
//           />
//           {errors.eventDescription && <span className="error">{errors.eventDescription}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="address1">Address:</label>
//           <input
//             type="text"
//             id="address1"
//             name="address1"
//             value={formData.address1}
//             onChange={handleChange}
//             maxLength="100"
//           />
//           {errors.address1 && <span className="error">{errors.address1}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="city">City:</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             maxLength="100"
//           />
//           {errors.city && <span className="error">{errors.city}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="state">State:</label>
//           <select
//             id="state"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//           >
//             <option value="">Select State</option>
//             {stateOptions.map(option => (
//               <option key={option} value={option}>{option}</option>
//             ))}
//           </select>
//           {errors.state && <span className="error">{errors.state}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="zipCode">Zip Code:</label>
//           <input
//             type="text"
//             id="zipCode"
//             name="zipCode"
//             value={formData.zipCode}
//             onChange={handleChange}
//             maxLength="9"
//           />
//           {errors.zipCode && <span className="error">{errors.zipCode}</span>}
//         </div>

//         <div className="form-group">
//           <label>Required Skills:</label>
//           <MultiSelect
//             options={skillOptions}
//             selected={formData.requiredSkills}
//             onChange={handleSkillsChange}
//           />
//           {errors.requiredSkills && <span className="error">{errors.requiredSkills}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="urgency">Urgency:</label>
//           <select
//             id="urgency"
//             name="urgency"
//             value={formData.urgency}
//             onChange={handleChange}
//           >
//             <option value="">Select Urgency</option>
//             {urgencyOptions.map(option => (
//               <option key={option} value={option}>{option}</option>
//             ))}
//           </select>
//           {errors.urgency && <span className="error">{errors.urgency}</span>}
//         </div>

//         <div className="form-group">
//           <label htmlFor="eventDate">Event Date:</label>
//           <input
//             type="date"
//             id="eventDate"
//             name="eventDate"
//             value={formData.eventDate}
//             onChange={handleChange}
//           />
//           {errors.eventDate && <span className="error">{errors.eventDate}</span>}
//         </div>

//         <div className="form-group time-slots">
//           <div className="time-slot">
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
//           <div className="time-slot">
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
//         </div>

//         <div className="submit-container">
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Submitting...' : 'Submit'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EventManagementForm;
