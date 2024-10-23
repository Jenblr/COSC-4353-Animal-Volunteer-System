const authController = require('../../controllers/authController');
const authService = require('../../services/authService');

const mockRequest = (body = {}) => ({
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

jest.mock('../../services/authService');

describe('AuthController', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    describe('register', () => {
        it('should return 201 and token when registration is successful', () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123', role: 'volunteer' });
            const res = mockResponse();

            authService.registerUser.mockReturnValue({
                status: 201,
                message: 'User registered successfully',
                token: 'test-token',
                needsProfile: true
            });

            authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                token: 'test-token',
                needsProfile: true
            });
        });

        it('should return 400 when email or password is missing', () => {
            const req = mockRequest({ email: '', password: '' });
            const res = mockResponse();

            authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
        });

        it('should return the correct error status and message from the service', () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();

            authService.registerUser.mockReturnValue({
                status: 500,
                message: 'Registration failed'
            });

            authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Registration failed' });
        });
    });

    describe('login', () => {
        it('should return 200 and token when login is successful', () => {
            const req = mockRequest({ email: 'test@example.com', password: 'password123' });
            const res = mockResponse();

            authService.loginUser.mockReturnValue({
                status: 200,
                token: 'test-token',
                role: 'volunteer'
            });

            authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                token: 'test-token',
                role: 'volunteer'
            });
        });

        it('should return the correct error status and message when login fails', () => {
            const req = mockRequest({ email: 'test@example.com', password: 'wrongpassword' });
            const res = mockResponse();

            authService.loginUser.mockReturnValue({
                status: 401,
                message: 'Invalid credentials'
            });

            authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });

    describe('getAllVolunteers', () => {
        it('should return 200 and a list of volunteers', () => {
            const req = mockRequest();
            const res = mockResponse();

            const mockVolunteers = [
                { id: 1, email: 'volunteer1@example.com', fullName: 'Volunteer One' },
                { id: 2, email: 'volunteer2@example.com', fullName: 'Volunteer Two' }
            ];

            authService.getAllVolunteers.mockReturnValue(mockVolunteers);

            authController.getAllVolunteers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockVolunteers.map(v => ({
                id: v.id,
                email: v.email,
                fullName: v.fullName
            })));
        });

        it('should return 500 if there is an error fetching volunteers', () => {
            const req = mockRequest();
            const res = mockResponse();

            authService.getAllVolunteers.mockImplementation(() => {
                throw new Error('Error fetching volunteers');
            });

            authController.getAllVolunteers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching volunteers', error: expect.any(Error) });
        });
    });

    describe('getRegisteredVolunteers', () => {
        it('should return 200 and a list of registered volunteers', () => {
            const req = mockRequest();
            const res = mockResponse();

            const mockRegisteredVolunteers = [
                { id: 1, email: 'registered1@example.com', fullName: 'Registered One' },
                { id: 2, email: 'registered2@example.com', fullName: 'Registered Two' }
            ];

            authService.getRegisteredVolunteers.mockReturnValue(mockRegisteredVolunteers);

            authController.getRegisteredVolunteers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockRegisteredVolunteers.map(v => ({
                id: v.id,
                email: v.email,
                fullName: v.fullName
            })));
        });

        it('should return 500 if there is an error fetching registered volunteers', () => {
            const req = mockRequest();
            const res = mockResponse();

            authService.getRegisteredVolunteers.mockImplementation(() => {
                throw new Error('Error fetching registered volunteers');
            });

            authController.getRegisteredVolunteers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching registered volunteers', error: expect.any(Error) });
        });
    });
});
