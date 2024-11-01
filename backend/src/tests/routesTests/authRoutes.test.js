const request = require('supertest');
const express = require('express');
const router = require('../../routes/authRoutes');
const authController = require('../../controllers/authController');
const authMiddleware = require('../../middleware/authMiddleware');
const validators = require('../../utils/validators');

jest.mock('../../controllers/authController');
jest.mock('../../middleware/authMiddleware');
jest.mock('../../utils/validators', () => ({
  validateRegistration: jest.fn(),
  validateLogin: jest.fn()
}));

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(router);

    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    const validRegistrationData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    it('should call validateRegistration middleware and register controller', async () => {
      validators.validateRegistration.mockImplementation((req, res, next) => next());
      
      authController.register.mockImplementation((req, res) => {
        res.status(201).json({ message: 'User registered successfully' });
      });

      const response = await request(app)
        .post('/register')
        .send(validRegistrationData);

      expect(validators.validateRegistration).toHaveBeenCalled();
      expect(authController.register).toHaveBeenCalled();
      expect(response.status).toBe(201);
    });

    it('should return error if validation fails', async () => {
      validators.validateRegistration.mockImplementation((req, res, next) => {
        res.status(400).json({ error: 'Validation failed' });
      });

      const response = await request(app)
        .post('/register')
        .send({});

      expect(validators.validateRegistration).toHaveBeenCalled();
      expect(authController.register).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should call validateLogin middleware and login controller', async () => {
      validators.validateLogin.mockImplementation((req, res, next) => next());
      
      authController.login.mockImplementation((req, res) => {
        res.status(200).json({ token: 'fake-token' });
      });

      const response = await request(app)
        .post('/login')
        .send(validLoginData);

      expect(validators.validateLogin).toHaveBeenCalled();
      expect(authController.login).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should return error if validation fails', async () => {
      validators.validateLogin.mockImplementation((req, res, next) => {
        res.status(400).json({ error: 'Invalid credentials' });
      });

      const response = await request(app)
        .post('/login')
        .send({});

      expect(validators.validateLogin).toHaveBeenCalled();
      expect(authController.login).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  describe('GET /volunteers', () => {
    it('should call auth middleware and return volunteers for admin users', async () => {
      authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
      authMiddleware.verifyAdmin.mockImplementation((req, res, next) => next());
      
      authController.getAllVolunteers.mockImplementation((req, res) => {
        res.status(200).json({ volunteers: [] });
      });

      const response = await request(app)
        .get('/volunteers')
        .set('Authorization', 'Bearer fake-token');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(authController.getAllVolunteers).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should return error if user is not authenticated', async () => {

      authMiddleware.verifyToken.mockImplementation((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app)
        .get('/volunteers');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).not.toHaveBeenCalled();
      expect(authController.getAllVolunteers).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it('should return error if user is not admin', async () => {

      authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
      authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
        res.status(403).json({ error: 'Forbidden' });
      });

      const response = await request(app)
        .get('/volunteers')
        .set('Authorization', 'Bearer fake-token');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(authController.getAllVolunteers).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });

  describe('GET /registered-volunteers', () => {
    it('should call auth middleware and return registered volunteers for admin users', async () => {
      authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
      authMiddleware.verifyAdmin.mockImplementation((req, res, next) => next());
      
      authController.getRegisteredVolunteers.mockImplementation((req, res) => {
        res.status(200).json({ registeredVolunteers: [] });
      });

      const response = await request(app)
        .get('/registered-volunteers')
        .set('Authorization', 'Bearer fake-token');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(authController.getRegisteredVolunteers).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should return error if user is not authenticated', async () => {
      authMiddleware.verifyToken.mockImplementation((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app)
        .get('/registered-volunteers');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).not.toHaveBeenCalled();
      expect(authController.getRegisteredVolunteers).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it('should return error if user is not admin', async () => {
      authMiddleware.verifyToken.mockImplementation((req, res, next) => next());
      authMiddleware.verifyAdmin.mockImplementation((req, res, next) => {
        res.status(403).json({ error: 'Forbidden' });
      });

      const response = await request(app)
        .get('/registered-volunteers')
        .set('Authorization', 'Bearer fake-token');

      expect(authMiddleware.verifyToken).toHaveBeenCalled();
      expect(authMiddleware.verifyAdmin).toHaveBeenCalled();
      expect(authController.getRegisteredVolunteers).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
    });
  });
});