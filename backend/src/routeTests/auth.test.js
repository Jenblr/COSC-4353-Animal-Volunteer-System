/* 'auth.test.js' file 
- Tests for authentication routes
*/

const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
	it('should register a user', async () => {
		const res = await request(app)
		.post('/api/auth/register')
		.send({ username: 'testuser', password: 'password123' });

		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('message', 'User registered successfully');
	});

	it('should login a user', async () => {
		const res = await request(app)
		.post('/api/auth/login')
		.send({ username: 'testuser', password: 'password123' });

		expect(res.statusCode).toEqual(200);
		expect(res.body).toHaveProperty('token');
	});
});
