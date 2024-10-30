const request = require('supertest');
const app = require('../../app');
const authService = require('../../services/authService');

jest.mock('../../services/authService');

describe('AuthController', () => {
    describe('POST /api/auth/register', () => {
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

        it('should return 400 if user already exists', async () => {
            authService.registerUser.mockReturnValue({
                status: 400,
                message: 'User already exists'
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existingUser@example.com',
                    password: 'password1234',
                    role: 'volunteer'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
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

        it('should return 404 if user not found', async () => {
            authService.loginUser.mockReturnValue({
                status: 404,
                message: 'User not found'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonExistentUser@example.com',
                    password: 'password1234'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');
        });

        it('should return 401 if password is incorrect', async () => {
            authService.loginUser.mockReturnValue({
                status: 401,
                message: 'Invalid credentials'
            });

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testUser@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});