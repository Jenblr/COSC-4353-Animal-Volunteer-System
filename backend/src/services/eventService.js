const volunteerHistoryService = require('../services/historyService');
const authService = require('../services/authService');
const notificationService = require('../services/notificationService');

const { Op } = require('sequelize');

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
    }
    catch (error) {
        throw {
            status: 500,
            message: 'Error searching events',
            error: error.message
        };
    }
};



