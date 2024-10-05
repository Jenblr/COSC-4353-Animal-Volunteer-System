const { verifyToken, verifyAdmin } = require('../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
    /* Testing if token is given after a user logs in */
    describe('verifyToken', () => {
        it('should call next if token is valid', () => {
            const req = { headers: { authorization: 'Bearer validtoken' } };
            const res = {};
            const next = jest.fn();

            jwt.verify = jest.fn((token, secret, callback) => {
                callback(null, { id: 'userId', role: 'volunteer' });
            });

            verifyToken(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(req.userId).toBe('userId');
            expect(req.userRole).toBe('volunteer');
        });

        // No token provided
        it('should return 403 if no token is provided', () => {
            const req = { headers: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        });

        // Invalid token
        it('should return 401 if token is invalid', () => {
            const req = { headers: { authorization: 'Bearer invalidtoken' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            jwt.verify = jest.fn((token, secret, callback) => {
                callback(new Error('Invalid token'), null);
            });

            verifyToken(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Failed to authenticate token' });
        });
    });

    /* Testing if the user has admin role */
    describe('verifyAdmin', () => {
        it('should call next if user is admin', () => {
            const req = { userRole: 'admin' };
            const res = {};
            const next = jest.fn();

            verifyAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        // Is only a regular (volunteer) user
        it('should return 403 if user is not admin', () => {
            const req = { userRole: 'volunteer' };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            verifyAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access forbidden: Admins only' });
        });
    });
});