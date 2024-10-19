const request = require('supertest');
const app = require('../../app');
const authService = require('../../services/authService');
const profileController = require('../../controllers/profileController');

jest.mock('../../services/authService');
jest.mock('../../controllers/profileController');

describe('Auth Routes', () => {
    it('should return home data for GET /api/auth/home', async () => {
        const response = await request(app).get('/api/auth/home');
        expect(response.status).toBe(200);
        expect(response.body).toBe('Home data');
    });

    it('should register a new user', async () => {
        authService.registerUser.mockReturnValue({
            status: 201,
            message: 'Temporary user created. Please complete your profile.',
            token: 'mockToken',
            needsProfile: true
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'newUser@example.com',
                password: 'password1234',
                role: 'volunteer'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Temporary user created. Please complete your profile.');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('needsProfile', true);
    });

    it('should login a user and return a token', async () => {
        authService.loginUser.mockReturnValue({
            status: 200,
            token: 'mockToken',
            role: 'volunteer'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testUser@example.com',
                password: 'password1234'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('role', 'volunteer');
    });

    it('should return form options for GET /api/auth/profile', async () => {
        const mockOptions = { states: ['CA', 'NY'], skills: ['Skill1', 'Skill2'] };
        profileController.getFormOptions.mockImplementation((req, res) => {
            res.status(200).json(mockOptions);
        });

        const response = await request(app).get('/api/auth/profile');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockOptions);
    });

    it('should return all volunteers for GET /api/auth/volunteers', async () => {
        const mockVolunteers = [{ id: 1, name: 'Volunteer 1' }, { id: 2, name: 'Volunteer 2' }];
        authService.getAllVolunteers.mockReturnValue(mockVolunteers);

        const response = await request(app).get('/api/auth/volunteers');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockVolunteers);
    });
});