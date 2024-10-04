/* 'authMiddleware' file:
- Protects routes by verifying the JWT tokens
*/

const jwt = require('jsonwebtoken');

// 'verifyToken' = Ensures the user is authenticated by verifying the JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Extracting token from array 
    if (!token) {
        return res.status(403).json({ message: 'Malformed token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role; // Extract user role from token
        next();
    });
};

// 'verifyAdmin' = Ensures the user is an admin by verifying the JWT token'
const verifyAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access forbidden: Admins only' });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };