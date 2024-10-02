/* 'authMiddleware' file:
- Proteccts routes by verifying the JWT tokens
*/

const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
	const token = req.headers['authorization'];
	if (!token) {
		return res.status(403).json({ message: 'No token provided' });
	}

	jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
		return res.status(401).json({ message: 'Failed to authenticate token' });
		}
		req.userId = decoded.id;
		next();
	});
};

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
	if (req.userRole !== 'admin') {
		return res.status(403).json({ message: 'Access forbidden: Admins only' });
	}
	next();
};

module.exports = { verifyToken, verifyAdmin };