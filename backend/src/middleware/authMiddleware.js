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

<<<<<<< HEAD
    const token = authHeader.split(' ')[1]; // Extracting token from array 
=======
    const token = authHeader.split(' ')[1]; 
>>>>>>> origin/JenniferN
    if (!token) {
        return res.status(403).json({ message: 'Malformed token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
<<<<<<< HEAD
        req.userRole = decoded.role; // Extract user role from token
=======
        req.userRole = decoded.role;
>>>>>>> origin/JenniferN
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