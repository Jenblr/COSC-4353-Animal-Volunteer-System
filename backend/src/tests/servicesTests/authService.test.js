require('dotenv').config({ path: require('path').resolve(__dirname, '../../tests/.env.test') });

const authService = require('../../services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the users array
let users = [];

beforeEach(() => {
    // Reset the users array before each test
    users = [
        {
            email: 'admin@example.com',
            password: bcrypt.hashSync('adminpassword', 8),
            role: 'admin'
        }
    ];
});

describe('AuthService', () => {
    /* Testing user registration = validate as new user versus existing user */
    describe('registerUser', () => {
        it('should register a new user', () => {
            const email = 'newUser@example.com';
            const password = 'password1234';
            const role = 'volunteer';

            const response = authService.registerUser(email, password, role);

            expect(response.status).toBe(201);
            expect(response.user).toHaveProperty('email', email);
            expect(response.user).toHaveProperty('role', role);
            expect(bcrypt.compareSync(password, response.user.password)).toBe(true);
        });

        // If user is already registered
        it('should return 400 if user already exists', () => {
            const email = 'newUser@example.com';
            const password = 'password1234';
            const role = 'volunteer';

            authService.registerUser(email, password, role);
            
            const response = authService.registerUser(email, password, role);
            expect(response.status).toBe(400);
            expect(response.message).toBe('User already exists');
        });
    });

    /* Testing user login */
    describe('loginUser', () => {
        it('should login a user and return a token', () => {
            const email = 'testUser@example.com';
            const password = 'password1234';
            const role = 'volunteer';

            authService.registerUser(email, password, role); // Register our test user first to then test the login

            const response = authService.loginUser(email, password);

            expect(response.status).toBe(200);
            expect(response.token).toBeDefined();
            const decoded = jwt.verify(response.token, process.env.JWT_SECRET);
            expect(decoded).toHaveProperty('email', email);
            expect(decoded).toHaveProperty('role', role);
        });

        // Non-existent user
        it('should return 404 if user not found', () => {
            const response = authService.loginUser('nonexistentuser@example.com', 'password1234');
            expect(response.status).toBe(404);
            expect(response.message).toBe('User not found');
        });

        // Incorrect password
        it('should return 401 if password is incorrect', () => {
            const email = 'testUser@example.com';
            const password = 'password1234';
            const role = 'volunteer';

            authService.registerUser(email, password, role);

            const response = authService.loginUser(email, 'wrongpassword');
            expect(response.status).toBe(401);
            expect(response.message).toBe('Invalid credentials');
        });
    });
});