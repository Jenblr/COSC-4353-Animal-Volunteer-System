const { validateRegistration, validateLogin } = require('../../utils/validators');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Test route for registration validation
app.post('/register', validateRegistration, (req, res) => {
    res.status(200).json({ message: 'Registration successful' });
});

// Test route for login validation
app.post('/login', validateLogin, (req, res) => {
    res.status(200).json({ message: 'Login successful' });
});

/* Testing if input for registration fields are valid */
describe('Registration Validator Tests', () => {
    it('should return an error if email is invalid', async () => {
        const res = await request(app)
            .post('/register')
            .send({ email: 'invalidEmail', password: 'password123', role: 'admin' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Must be a valid email address');
    });

    it('should return an error if password is less than 8 characters', async () => {
        const res = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'short', role: 'volunteer' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Password must be at least 8 characters long');
    });

    it('should return an error if role is invalid', async () => {
        const res = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', role: 'invalidRole' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Role must be either admin or volunteer');
    });

    it('should succeed if all fields are valid', async () => {
        const res = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', role: 'admin' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Registration successful');
    });
});

/* Testing if input for login fields are valid */
describe('Login Validator Tests', () => {
    it('should return an error if email is invalid', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'invalidEmail', password: 'password123' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Must be a valid email address');
    });

    it('should return an error if password is missing', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: '' });

        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Password is required');
    });

    it('should succeed if all fields are valid', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Login successful');
    });
});