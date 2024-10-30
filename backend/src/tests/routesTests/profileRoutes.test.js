const request = require('supertest');
const express = require('express');
const profileRoutes = require('../../routes/profileRoutes');
const profileController = require('../../controllers/profileController');

jest.mock('../../controllers/profileController');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

describe('Profile Routes', () => {
  test('POST /api/profile/finalize-registration should finalize registration', async () => {
    profileController.finalizeRegistration.mockImplementation((req, res) => {
      res.status(201).json({ message: 'Registration finalized' });
    });

    const response = await request(app)
      .post('/api/profile/finalize-registration')
      .send({ token: 'testToken', fullName: 'Test User' });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Registration finalized');
  });
});