const request = require('supertest');
const app = require('../app');
const authService = require('../services/authService');

jest.mock('../services/authService');

describe('App', () => {
    it('should return 200 OK for the root route', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Animal Volunteer System Backend');
    });

    it('should return 404 for an unknown route', async () => {
        const response = await request(app).get('/unknown-route');
        expect(response.status).toBe(404);
    });

    describe('Auth Routes', () => {
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
    });
});