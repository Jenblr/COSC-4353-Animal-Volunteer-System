import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Calendar.css';

const Calendar = ({ isAdmin }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ 
    title: '', 
    startHour: '09', 
    startMinute: '00', 
    endHour: '10', 
    endMinute: '00' 
  });

  // Fetch events from the backend when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Full response:', response);
        const eventData = response.data;
        console.log('Fetched event data:', eventData);

        // Process event data by date
        const eventsArray = Array.isArray(eventData) ? eventData : eventData.events || [];
        const eventsByDate = eventsArray.reduce((acc, event) => {
          const dateString = event.eventDate; // Assuming 'eventDate' is in 'YYYY-MM-DD' format
          if (!acc[dateString]) {
            acc[dateString] = [];
          }
          acc[dateString].push({
            id: event.id, 
            title: event.eventName,
            startTime: event.startTime,
            endTime: event.endTime
          });
          return acc;
        }, {});

        setEvents(eventsByDate); // Update state with date-keyed object
      } catch (error) {
        console.error('Error fetching events:', error.response ? error.response.data : error.message);
    }
  };

    fetchEvents();
  }, []);

  // useEffect(() => {
  //   const mockEvents = [
  //     {
  //       id: '1',
  //       eventName: 'Animal Shelter Cleanup',
  //       eventDescription: 'Help clean and organize the animal shelter.',
  //       address1: '123 Shelter Lane',
  //       city: 'Anytown',
  //       state: 'CA',
  //       zipCode: '12345',
  //       requiredSkills: ['Cleaning', 'Animal Care'],
  //       urgency: 'Medium',
  //       eventDate: '2024-06-15',
  //       startTime: '09:00',
  //       endTime: '14:00',
  //     },
  //     {
  //       id: '2',
  //       eventName: 'Dog Walking Day',
  //       eventDescription: 'Volunteers needed to walk dogs from the shelter.',
  //       address1: '456 Park Avenue',
  //       city: 'Dogville',
  //       state: 'NY',
  //       zipCode: '67890',
  //       requiredSkills: ['Dog Walking','Animal care'],
  //       urgency: 'Low',
  //       eventDate: '2024-10-01',
  //       startTime: '10:00',
  //       endTime: '12:00',
  //     },
  //     {
  //       id: '3',
  //       eventName: 'Emergency Vet Assistance',
  //       eventDescription: 'Assist veterinarians with emergency cases.',
  //       address1: '789 Vet Clinic Road',
  //       city: 'Petsburg',
  //       state: 'TX',
  //       zipCode: '54321',
  //       requiredSkills: ['Medication', 'Emergency Response'],
  //       urgency: 'High',
  //       eventDate: '2024-10-30',
  //       startTime: '08:00',
  //       endTime: '20:00',
  //     }
  //   ];
  
  //   // Group events by eventDate (e.g., '2024-06-15')
  //   const mockEventsByDate = mockEvents.reduce((acc, event) => {
  //     const dateString = event.eventDate;
  //     if (!acc[dateString]) {
  //       acc[dateString] = [];
  //     }
  //     acc[dateString].push(event);
  //     return acc;
  //   }, {});
  
  //   console.log("Mocked events by date:", mockEventsByDate); // <-- Check if the events are grouped by date correctly
  //   setEvents(mockEventsByDate); // Set the processed mock events into the state
  // }, []);

  // Helper to calculate the number of days in the current month
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  // Helper to calculate the first day of the current month
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Render days of the calendar
  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Empty divs for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month with events
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const dayEvents = events[dateString] || []; // Fetch events for the specific date

      days.push(
        <div key={day} className="calendar-day">
          <span className="day-number">{day}</span>

          {/* Display events for the current day */}
          {dayEvents.map(event => (
            <div
              key={event.id} // Ensure unique key for each event
              className="event-item"
            >
              <span className="event-title">{event.eventName}</span> {/* Display eventName */}
              <span className="event-time">{`${event.startTime} - ${event.endTime}`}</span>
              <div className="event-tooltip">
                <strong>{event.eventName}</strong>
                <br />
                {`${event.startTime} - ${event.endTime}`}
              </div>
            </div>
          ))}


          {/* Admin can add new events */}
          {isAdmin && (
            <button className="add-event-btn" onClick={() => handleAddEventClick(date)}>+</button>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleAddEventClick = (date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEvent.title.trim() !== '') {
      const dateString = selectedDate.toISOString().split('T')[0];
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateString]: [...(prevEvents[dateString] || []), newEvent]
      }));
      setNewEvent({ 
        title: '', 
        startHour: '09', 
        startMinute: '00', 
        endHour: '10', 
        endMinute: '00' 
      });
      setShowEventForm(false);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>❮</button>
        <h2>Event Calendar</h2>
        <button onClick={() => changeMonth(1)}>❯</button>
      </div>
      <div className="calendar-subheader">
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
      </div>
      <div className="calendar-grid">
        <div className="calendar-day-header">Sun</div>
        <div className="calendar-day-header">Mon</div>
        <div className="calendar-day-header">Tue</div>
        <div className="calendar-day-header">Wed</div>
        <div className="calendar-day-header">Thu</div>
        <div className="calendar-day-header">Fri</div>
        <div className="calendar-day-header">Sat</div>
        {renderCalendarDays()}
      </div>
      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h4>Add Event for {selectedDate.toDateString()}</h4>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title"
              />
              {/* Time selection inputs... */}
              <button type="submit">Add Event</button>
              <button type="button" onClick={() => setShowEventForm(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;