const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const authService = require('../../services/authService');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('crypto');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    crypto.randomBytes.mockReturnValue({
      toString: jest.fn().mockReturnValue('mockedToken')
    });
    authService.clearUsers();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', () => {
      const result = authService.registerUser('newuser@example.com', 'password123', 'volunteer');
      
      expect(result.status).toBe(201);
      expect(result.message).toBe('Temporary user created. Please complete your profile.');
      expect(result.token).toBe('mockedToken');
      expect(result.needsProfile).toBe(true);
    });

    it('should return error if user already exists', () => {
      authService.registerUser('existinguser@example.com', 'password123', 'volunteer');
      const result = authService.registerUser('existinguser@example.com', 'password123', 'volunteer');
      
      expect(result.status).toBe(400);
      expect(result.message).toBe('User already exists');
    });
  });

  describe('loginUser', () => {
    it('should login a user successfully', () => {
      authService.registerUser('testuser@example.com', 'password123', 'volunteer');
      const tempUser = authService.verifyTemporaryUserByToken('mockedToken');
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
      authService.registerUser('testuser@example.com', 'password123', 'volunteer');
      const tempUser = authService.verifyTemporaryUserByToken('mockedToken');
      authService.finalizeRegistration(tempUser.id);
      
      bcrypt.compareSync.mockReturnValue(false);

      const result = authService.loginUser('testuser@example.com', 'wrongpassword');
      
      expect(result.status).toBe(401);
      expect(result.message).toBe('Invalid credentials');
    });
  });

  describe('verifyTemporaryUserByToken', () => {
    it('should verify a temporary user successfully', () => {
      authService.registerUser('tempuser@example.com', 'password123', 'volunteer');
      
      const result = authService.verifyTemporaryUserByToken('mockedToken');
      
      expect(result).toBeDefined();
      expect(result.email).toBe('tempuser@example.com');
    });

    it('should return undefined for non-existent token', () => {
      const result = authService.verifyTemporaryUserByToken('nonexistenttoken');
      
      expect(result).toBeUndefined();
    });
  });

  describe('finalizeRegistration', () => {
    it('should finalize registration successfully', () => {
      authService.registerUser('finaluser@example.com', 'password123', 'volunteer');
      const tempUser = authService.verifyTemporaryUserByToken('mockedToken');
      
      const result = authService.finalizeRegistration(tempUser.id);
      
      expect(result.status).toBe(200);
      expect(result.message).toBe('Registration finalized successfully');
    });

    it('should return error if temporary user not found', () => {
      const result = authService.finalizeRegistration(999);
      
      expect(result.status).toBe(404);
      expect(result.message).toBe('Temporary user not found');
    });
  });

});