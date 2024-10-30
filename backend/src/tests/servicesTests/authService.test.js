const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authService = require('../../services/authService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('AuthService', () => {
	let tokenCounter = 0;

	beforeEach(() => {
		jest.clearAllMocks();
		tokenCounter = 0;
		crypto.randomBytes.mockImplementation(() => ({
			toString: () => `mockedToken${++tokenCounter}`
		}));
		authService.clearUsers();
	});

	describe('registerUser', () => {
		it('should register a new admin user successfully', () => {
			const result = authService.registerUser('admin2@example.com', 'adminpassword', 'admin');

			expect(result.status).toBe(201);
			expect(result.message).toBe('Temporary user created. Please complete your profile.');
			expect(result.token).toBe('mockedToken1');
			expect(result.needsProfile).toBe(true);
		});

		it('should register a volunteer user when no role is specified', () => {
			const result = authService.registerUser('volunteer@example.com', 'password123');

			const user = authService.verifyTemporaryUserByToken(result.token);
			expect(user.role).toBe('volunteer');
			expect(result.status).toBe(201);
		});

		it('should prevent registration with existing admin email', () => {
			const result = authService.registerUser('admin@example.com', 'newpassword', 'volunteer');

			expect(result.status).toBe(400);
			expect(result.message).toBe('User already exists');
		});

		it('should prevent registration with existing volunteer email', () => {
			const firstResult = authService.registerUser('volunteer@example.com', 'password123', 'volunteer');
			const tempUser = authService.verifyTemporaryUserByToken(firstResult.token);
			authService.finalizeRegistration(tempUser.id, { name: 'John' });

			const result = authService.registerUser('volunteer@example.com', 'newpassword', 'volunteer');

			expect(result.status).toBe(400);
			expect(result.message).toBe('User already exists');
		});

		it('should prevent registration with existing temporary user email', () => {
			authService.registerUser('temp@example.com', 'password123', 'volunteer');

			const result = authService.registerUser('temp@example.com', 'newpassword', 'volunteer');

			expect(result.status).toBe(400);
			expect(result.message).toBe('User already exists');
		});

		it('should hash the password before storing user', () => {
			bcrypt.hashSync.mockReturnValue('hashedPassword123');
			const result = authService.registerUser('hashuser@example.com', 'password123', 'volunteer');

			expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 8);
			expect(result.status).toBe(201);
		});
	});

	describe('loginUser', () => {
		it('should login a user successfully', () => {
			const registerResult = authService.registerUser('testuser@example.com', 'password123', 'volunteer');
			const tempUser = authService.verifyTemporaryUserByToken(registerResult.token);
			authService.finalizeRegistration(tempUser.id);

			bcrypt.compareSync.mockReturnValue(true);
			jwt.sign.mockReturnValue('jwtToken');

			const result = authService.loginUser('testuser@example.com', 'password123');

			expect(result.status).toBe(200);
			expect(result.token).toBe('jwtToken');
			expect(result.role).toBe('volunteer');
		});

		it('should return error if user not found', () => {
			const result = authService.loginUser('nonexistent@example.com', 'password123');

			expect(result.status).toBe(404);
			expect(result.message).toBe('User not found');
		});

		it('should return error if password is incorrect', () => {
			const registerResult = authService.registerUser('testuser@example.com', 'password123', 'volunteer');
			const tempUser = authService.verifyTemporaryUserByToken(registerResult.token);
			authService.finalizeRegistration(tempUser.id);

			bcrypt.compareSync.mockReturnValue(false);

			const result = authService.loginUser('testuser@example.com', 'wrongpassword');

			expect(result.status).toBe(401);
			expect(result.message).toBe('Invalid credentials');
		});
	});

	describe('verifyTemporaryUserByToken', () => {
		it('should verify a temporary user successfully', () => {
			const registerResult = authService.registerUser('tempuser@example.com', 'password123', 'volunteer');

			const result = authService.verifyTemporaryUserByToken(registerResult.token);

			expect(result).toBeDefined();
			expect(result.email).toBe('tempuser@example.com');
		});

		it('should return undefined for non-existent token', () => {
			const result = authService.verifyTemporaryUserByToken('nonexistenttoken');

			expect(result).toBeUndefined();
		});
	});

	describe('finalizeRegistration', () => {
		it('should finalize registration with profile data', () => {
			const registerResult = authService.registerUser('profileuser@example.com', 'password123', 'volunteer');
			const tempUser = authService.verifyTemporaryUserByToken(registerResult.token);

			const profileData = { name: 'John Doe', age: 25 };
			const result = authService.finalizeRegistration(tempUser.id, profileData);

			expect(result.status).toBe(200);
			expect(result.message).toBe('Registration finalized successfully');
			const registeredUser = authService.getRegisteredVolunteers().find(user => user.id === tempUser.id);
			expect(registeredUser.name).toBe('John Doe');
			expect(registeredUser.age).toBe(25);
		});

		it('should handle non-existent temporary user ID', () => {
			const result = authService.finalizeRegistration(999, { name: 'John' });

			expect(result.status).toBe(404);
			expect(result.message).toBe('Temporary user not found');
		});

		it('should properly transfer all user data during finalization', () => {
			const registerResult = authService.registerUser('complete@example.com', 'password123', 'volunteer');
			const tempUser = authService.verifyTemporaryUserByToken(registerResult.token);

			const profileData = {
				name: 'John Doe',
				age: 25,
				phone: '123-456-7890',
				address: '123 Main St'
			};

			authService.finalizeRegistration(tempUser.id, profileData);
			const registeredUser = authService.getRegisteredVolunteers().find(user => user.id === tempUser.id);

			expect(registeredUser).toMatchObject({
				...profileData,
				email: 'complete@example.com',
				role: 'volunteer',
				isRegistered: true
			});
			expect(registeredUser.password).toBeDefined();
			expect(registeredUser.token).toBe(tempUser.token);
		});
	});

	describe('removeExpiredTemporaryUsers', () => {
		it('should remove expired temporary users', () => {
			const result1 = authService.registerUser('tempuser1@example.com', 'password123', 'volunteer');
			const tempUser1 = authService.verifyTemporaryUserByToken(result1.token);
			authService.setTemporaryUserCreatedAt(tempUser1.token, new Date(Date.now() - 11 * 60 * 1000));

			const result2 = authService.registerUser('tempuser2@example.com', 'password123', 'volunteer');
			const tempUser2 = authService.verifyTemporaryUserByToken(result2.token);
			authService.setTemporaryUserCreatedAt(tempUser2.token, new Date(Date.now() - 9 * 60 * 1000));

			authService.removeExpiredTemporaryUsers();
			const remainingTempUsers = authService.getTemporaryUsers();

			expect(remainingTempUsers.length).toBe(1);
			expect(remainingTempUsers[0].email).toBe('tempuser2@example.com');
		});

		it('should not remove any temporary users if none are expired', () => {
			const result = authService.registerUser('tempuser1@example.com', 'password123', 'volunteer');
			const tempUser1 = authService.verifyTemporaryUserByToken(result.token);
			authService.setTemporaryUserCreatedAt(tempUser1.token, new Date(Date.now() - 5 * 60 * 1000));

			authService.removeExpiredTemporaryUsers();
			const remainingTempUsers = authService.getTemporaryUsers();

			expect(remainingTempUsers.length).toBe(1);
			expect(remainingTempUsers[0].email).toBe('tempuser1@example.com');
		});
	});

	describe('clearUsers', () => {
		it('should clear all temporary and volunteer users', () => {
			authService.registerUser('clearuser1@example.com', 'password123', 'volunteer');
			authService.registerUser('clearuser2@example.com', 'password123', 'volunteer');

			authService.clearUsers();

			expect(authService.getRegisteredVolunteers().length).toBe(0);
			expect(authService.getTemporaryUsers().length).toBe(0);
		});
	});

	describe('getAllVolunteers', () => {
		it('should return all volunteer users', () => {
			const result1 = authService.registerUser('vol1@example.com', 'pass123', 'volunteer');
			const tempUser1 = authService.verifyTemporaryUserByToken(result1.token);
			authService.finalizeRegistration(tempUser1.id, { name: 'Vol 1' });

			const result2 = authService.registerUser('vol2@example.com', 'pass123', 'volunteer');
			const tempUser2 = authService.verifyTemporaryUserByToken(result2.token);
			authService.finalizeRegistration(tempUser2.id, { name: 'Vol 2' });

			const volunteers = authService.getAllVolunteers();

			expect(volunteers.length).toBe(2);
			expect(volunteers.map(v => v.email)).toContain('vol1@example.com');
			expect(volunteers.map(v => v.email)).toContain('vol2@example.com');
		});

		it('should return empty array when no volunteers exist', () => {
			const volunteers = authService.getAllVolunteers();
			expect(volunteers).toEqual([]);
		});
	});

	describe('getRegisteredVolunteers', () => {
		it('should return only registered volunteers', () => {
			const result1 = authService.registerUser('registered@example.com', 'pass123', 'volunteer');
			const tempUser1 = authService.verifyTemporaryUserByToken(result1.token);
			authService.finalizeRegistration(tempUser1.id, { name: 'Registered Vol' });

			authService.registerUser('temp@example.com', 'pass123', 'volunteer');

			const registeredVolunteers = authService.getRegisteredVolunteers();

			expect(registeredVolunteers.length).toBe(1);
			expect(registeredVolunteers[0].email).toBe('registered@example.com');
			expect(registeredVolunteers[0].isRegistered).toBe(true);
		});

		it('should return empty array when no registered volunteers exist', () => {
			authService.registerUser('temp1@example.com', 'pass123', 'volunteer');
			authService.registerUser('temp2@example.com', 'pass123', 'volunteer');

			const registeredVolunteers = authService.getRegisteredVolunteers();
			expect(registeredVolunteers).toEqual([]);
		});
	});
});