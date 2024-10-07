const request = require('supertest');
const app = require('../../app');
const authService = require('../../services/authService');

describe('AuthController', () => {
    /* Testing Registration response */
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newUser@example.com',
                    password: 'password1234',
                    role: 'volunteer'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body.user).toHaveProperty('email', 'newUser@example.com');
        });

        // User already registered
        it('should return 400 if user already exists', async () => {
            await authService.registerUser('newUser@example.com', 'password1234', 'volunteer');

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newUser@example.com',
                    password: 'password1234',
                    role: 'volunteer'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'User already exists');
        });
    });

    /* Testing Login response */
    describe('POST /api/auth/login', () => {
        it('should login a user and return a token', async () => {
            await authService.registerUser('testUser@example.com', 'password1234', 'volunteer');

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testUser@example.com',
                    password: 'password1234'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        // User not found
        it('should return 404 if user not found', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonExistentUser@example.com',
                    password: 'password1234'
                });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'User not found');
        });

        // Password input is not valid
        it('should return 401 if password is incorrect', async () => {
            await authService.registerUser('testUser@example.com', 'password1234', 'volunteer');

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
