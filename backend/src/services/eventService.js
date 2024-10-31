const volunteerHistoryService = require('../services/historyService');
const authService = require('../services/authService');
const notificationService = require('../services/notificationService');

;

// const validateEventData = (eventData) => {
// 	const errors = {};

// 	if (!eventData.eventName || eventData.eventName.trim().length === 0) {
// 		errors.eventName = 'Event Name is required';
// 	} else if (eventData.eventName.length > 100) {
// 		errors.eventName = 'Event Name must be 100 characters or less';
// 	}

// 	if (!eventData.eventDescription || eventData.eventDescription.trim().length === 0) {
// 		errors.eventDescription = 'Event Description is required';
// 	}

// 	if (!eventData.address1 || eventData.address1.trim().length === 0) {
// 		errors.address1 = 'Address 1 is required';
// 	}

// 	if (!eventData.city || eventData.city.trim().length === 0) {
// 		errors.city = 'City is required';
// 	}

// 	if (!eventData.state || eventData.state.trim().length === 0) {
// 		errors.state = 'State is required';
// 	}

// 	if (!eventData.zipCode || eventData.zipCode.trim().length === 0) {
// 		errors.zipCode = 'Zip Code is required';
// 	}

// 	if (!eventData.requiredSkills || eventData.requiredSkills.length === 0) {
// 		errors.requiredSkills = 'At least one skill is required';
// 	}

// 	if (!eventData.urgency) {
// 		errors.urgency = 'Urgency is required';
// 	}

// 	if (!eventData.eventDate) {
// 		errors.eventDate = 'Event Date is required';
// 	}

// 	return errors;
// };

// exports.createEvent = (eventData) => {
// 	const errors = validateEventData(eventData);
// 	if (Object.keys(errors).length > 0) {
// 		throw { status: 400, errors };
// 	}

// 	const newEvent = {
// 		id: (events.length + 1).toString(),
// 		...eventData,
// 		createdAt: new Date().toISOString()
// 	};

// 	events.push(newEvent);

// 	notificationService.createEventNotification(newEvent);

// 	const allVolunteers = authService.getAllVolunteers();
// 	allVolunteers.forEach(volunteer => {
// 		const historyRecord = {
// 			eventId: newEvent.id,
// 			eventName: newEvent.eventName,
// 			eventDescription: newEvent.eventDescription,
// 			location: `${newEvent.address1}, ${newEvent.city}, ${newEvent.state} ${newEvent.zipCode}`,
// 			requiredSkills: newEvent.requiredSkills,
// 			urgency: newEvent.urgency,
// 			eventDate: newEvent.eventDate,
// 			startTime: newEvent.startTime,
// 			endTime: newEvent.endTime,
// 			participationStatus: 'Not Attended'
// 		};

// 		volunteerHistoryService.updateHistoryRecord(volunteer.id, historyRecord);
// 	});

// 	return {
// 		message: "Event created successfully",
// 		event: newEvent
// 	};
// };

// exports.getAllEvents = () => {
// 	return events;
// };

// exports.getEventById = (id) => {
// 	console.log('Looking for event with ID:', id);

// 	const event = events.find(e => e.id === id.toString());

// 	if (!event) {
// 		console.log('No event found with ID:', id);
// 		throw { status: 404, message: 'Event not found' };
// 	}

// 	console.log('Found event:', event);
// 	return event;
// };

// exports.updateEvent = (id, eventData) => {
// 	const index = events.findIndex(e => e.id === String(id));
// 	if (index === -1) {
// 		throw { status: 404, message: 'Event not found' };
// 	}

// 	const errors = validateEventData(eventData);
// 	if (Object.keys(errors).length > 0) {
// 		throw { status: 400, errors };
// 	}

// 	const updatedEvent = { ...events[index], ...eventData, updatedAt: new Date().toISOString() };
// 	events[index] = updatedEvent;
// 	return {
// 		message: "Event updated successfully",
// 		event: updatedEvent
// 	};
// };

// exports.deleteEvent = (id) => {
// 	const index = events.findIndex(e => e.id === String(id));
// 	if (index === -1) {
// 		throw { status: 404, message: 'Event not found' };
// 	}
// 	events.splice(index, 1);
// 	return { message: "Event deleted successfully" };
// };

// exports.getFormOptions = () => {
// 	return {
// 		skillOptions: [
// 			'Animal Care',
// 			'Assisting Potential Adopters',
// 			'Cleaning',
// 			'Dog Walking',
// 			'Emergency Response',
// 			'Event Coordination',
// 			'Exercise',
// 			'Feeding',
// 			'Grooming',
// 			'Helping with Laundry',
// 			'Medication',
// 			'Organizing Shelter Donations',
// 			'Potty and Leash Training',
// 			'Taking Photos of Animals',
// 			'Temporary Foster Care'
// 		],
// 		urgencyOptions: ['Low', 'Medium', 'High', 'Critical'],
// 		stateOptions: [
// 			'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
// 			'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
// 			'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
// 			'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
// 			'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
// 		]
// 	};
// };

// services/eventService.js
const { Event, State, User } = require('../../models');

// Predefined skills list
const AVAILABLE_SKILLS = [
    'Animal Care',
    'Assisting Potential Adopters',
    'Cleaning',
    'Dog Walking',
    'Emergency Response',
    'Event Coordination',
    'Exercise',
    'Feeding',
    'Grooming',
    'Helping with Laundry',
    'Medication',
    'Organizing Shelter Donations',
    'Potty and Leash Training',
    'Taking Photos of Animals',
    'Temporary Foster Care'
];

// Get form options for dropdowns
exports.getFormOptions = async () => {
    try {
        const states = await State.findAll({
            attributes: ['code', 'name'],
            order: [['name', 'ASC']]
        });

        return {
            states,
            skills: AVAILABLE_SKILLS,
            urgencyLevels: ['Low', 'Medium', 'High', 'Critical']
        };
    } catch (error) {
        throw {
            status: 500,
            message: 'Error fetching form options',
            error: error.message
        };
    }
};


// Get all events
exports.getAllEvents = async () => {
    try {
        const events = await Event.findAll({
            include: [
                {
                    model: State,
                    attributes: ['code', 'name']
                },
                {
                    model: User,
                    attributes: ['email']
                }
            ],
            order: [['eventDate', 'ASC']]
        });
        return events;
    } catch (error) {
        throw {
            status: 500,
            message: 'Error fetching events',
            error: error.message
        };
    }
};
exports.createEvent = async (eventData, userId) => {
    try {
        console.log('Creating event with data:', eventData);
        console.log('User ID received:', userId);  // Add this log

        // Validate skills
        const invalidSkills = eventData.requiredSkills.filter(
            skill => !AVAILABLE_SKILLS.includes(skill)
        );
        
        if (invalidSkills.length > 0) {
            throw {
                status: 400,
                message: 'Invalid skills provided',
                invalidSkills
            };
        }

        // Validate state exists
        const stateExists = await State.findOne({
            where: { code: eventData.state }
        });

        if (!stateExists) {
            throw {
                status: 400,
                message: 'Invalid state code provided'
            };
        }

        // Explicitly add the userId to eventData
        const eventWithUser = {
            ...eventData,
            createdBy: userId
        };

        console.log('Final event data:', eventWithUser);  // Add this log

        const event = await Event.create(eventWithUser);

        return {
            message: "Event created successfully",
            event: await this.getEventById(event.id)
        };
    } catch (error) {
        console.error('Error in createEvent service:', error);  // Add this log
        if (error.name === 'SequelizeValidationError') {
            throw {
                status: 400,
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            };
        }
        throw error;
    }
};


// Get event by ID
exports.getEventById = async (id) => {
    try {
        const event = await Event.findByPk(id, {
            include: [
                {
                    model: State,
                    attributes: ['code', 'name']
                },
                {
                    model: User,
                    attributes: ['email']
                }
            ]
        });

        if (!event) {
            throw {
                status: 404,
                message: 'Event not found'
            };
        }

        return event;
    } catch (error) {
        throw error;
    }
};

// Update event
exports.updateEvent = async (id, eventData, userId) => {
    try {
        const event = await Event.findByPk(id);
        
        if (!event) {
            throw {
                status: 404,
                message: 'Event not found'
            };
        }

        if (event.createdBy !== userId) {
            throw {
                status: 403,
                message: 'Unauthorized to update this event'
            };
        }

        // Validate skills if provided
        if (eventData.requiredSkills) {
            const invalidSkills = eventData.requiredSkills.filter(
                skill => !AVAILABLE_SKILLS.includes(skill)
            );
            
            if (invalidSkills.length > 0) {
                throw {
                    status: 400,
                    message: 'Invalid skills provided',
                    invalidSkills
                };
            }
        }

        // Validate state if provided
        if (eventData.state) {
            const stateExists = await State.findOne({
                where: { code: eventData.state }
            });

            if (!stateExists) {
                throw {
                    status: 400,
                    message: 'Invalid state code provided'
                };
            }
        }

        await event.update(eventData);

        return {
            message: "Event updated successfully",
            event: await this.getEventById(id)
        };
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            throw {
                status: 400,
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            };
        }
        throw error;
    }
};

// Delete event
exports.deleteEvent = async (id, userId) => {
    try {
        const event = await Event.findByPk(id);
        
        if (!event) {
            throw {
                status: 404,
                message: 'Event not found'
            };
        }

        if (event.createdBy !== userId) {
            throw {
                status: 403,
                message: 'Unauthorized to delete this event'
            };
        }

        await event.destroy();
        
        return {
            message: "Event deleted successfully"
        };
    } catch (error) {
        throw error;
    }
};

// Search events by criteria
exports.searchEvents = async (criteria) => {
    try {
        const where = {};

        if (criteria.state) {
            where.state = criteria.state;
        }

        if (criteria.urgency) {
            where.urgency = criteria.urgency;
        }

        if (criteria.skills) {
            where.requiredSkills = {
                [Op.overlap]: criteria.skills // PostgreSQL array overlap
            };
        }

        if (criteria.startDate && criteria.endDate) {
            where.eventDate = {
                [Op.between]: [criteria.startDate, criteria.endDate]
            };
        }

        const events = await Event.findAll({
            where,
            include: [
                {
                    model: State,
                    attributes: ['code', 'name']
                },
                {
                    model: User,
                    attributes: ['email']
                }
            ],
            order: [['eventDate', 'ASC']]
        });

        return events;
    } catch (error) {
        throw {
            status: 500,
            message: 'Error searching events',
            error: error.message
        };
    }
};