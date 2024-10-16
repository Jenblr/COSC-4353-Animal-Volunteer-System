const request = require('supertest');
const express = require('express');
const eventRoutes = require('../../routes/eventRoutes');
const { verifyToken, verifyAdmin } = require('../../middleware/authMiddleware');
const eventService = require('../../services/eventService');

jest.mock('../../middleware/authMiddleware', () => ({
  verifyToken: jest.fn((req, res, next) => next()),
  verifyAdmin: jest.fn((req, res, next) => next())
}));

//setup the app and routes for testing
const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

// reset the events array before each test to prevent shared state issues
const originalEvents = [...eventService.getAllEvents()];
beforeEach(() => {
  eventService.getAllEvents().length = 0;
  originalEvents.forEach(event => eventService.createEvent({ ...event }));
});

describe('Event Routes', () => {
  test('GET /events should return all events', async () => {
    const response = await request(app).get('/events');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('POST /events should create a new event', async () => {
    const newEvent = {
      eventName: 'New Test Event',
      eventDescription: 'Test Description',
      address1: '123 Test St',
      city: 'Test City',
      state: 'TX',
      zipCode: '12345',
      requiredSkills: ['Cleaning'],
      urgency: 'Medium',
      eventDate: '2024-12-01',
      startTime: '09:00',
      endTime: '12:00'
    };

    const response = await request(app)
      .post('/events')
      .send(newEvent);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Event created successfully');
  });

  test('GET /events/:id should return a specific event', async () => {
    const response = await request(app).get('/events/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  test('PUT /events/:id should update an event', async () => {
    const updatedData = {
      eventName: 'Updated Event Name',
      eventDescription: 'Updated Description',
      address1: 'Updated Address',
      city: 'Updated City',
      state: 'TX',
      zipCode: '12345',
      requiredSkills: ['Updated Skill'],
      urgency: 'High',
      eventDate: '2024-12-25',
      startTime: '10:00',
      endTime: '14:00'
    };

    const response = await request(app)
      .put('/events/1')
      .send(updatedData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event updated successfully');
  });

  test('DELETE /events/:id should delete an event', async () => {
    const response = await request(app).delete('/events/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted successfully');
  });

  test('POST /events should return 400 for invalid input', async () => {
    const invalidEvent = {
      eventName: '', //invalid: empty string
      eventDescription: 'Test Description',
      address1: 'A'.repeat(101), //invalid: exceeds 100 characters
      city: '',  //invalid: empty string
      state: 'Invalid', //invalid: not a valid state code
      zipCode: '1234', //invalid: less than 5 characters
      requiredSkills: [], //invalid: empty array
      urgency: 'Invalid', //invalid: not a valid urgency level
      eventDate: '2024/12/01', //invalid: incorrect date format
      startTime: '9:00', //invalid: incorrect time format
      endTime: '08:00' //invalid: end time before start time
    };

    const response = await request(app)
      .post('/events')
      .send(invalidEvent);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.objectContaining({
      eventName: expect.any(String),
      city: expect.any(String),
      requiredSkills: expect.any(String),
    }));
  });

  test('PUT /events/:id should return 404 for non-existent event', async () => {
    const updatedData = { eventName: 'Updated Event Name' };
    const response = await request(app)
      .put('/events/999')
      .send(updatedData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Event not found');
  });

  test('DELETE /events/:id should return 404 for non-existent event', async () => {
    const response = await request(app).delete('/events/999');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('message', 'Event not found');
  });

  test('GET /events/form-options should return valid options', async () => {
    const response = await request(app).get('/events/form-options');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('skillOptions');
    expect(response.body).toHaveProperty('urgencyOptions');
  });
});
