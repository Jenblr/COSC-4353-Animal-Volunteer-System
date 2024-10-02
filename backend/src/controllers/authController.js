/* 'authController.js' file:
- Handles user registration and login
- Uses bcrypt for password hasing and jwt for token generation
- Simulates a user database with an array (since we're not implementing our SQL yet)
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sample users array to simulate a database
const users = [];

/* REGISTRATION */
exports.register = (req, res) => {
	console.log('Request body:', req.body); // Log the entire request body

	const { username, password, role } = req.body;

	console.log('Username:', username); 
	console.log('Password:', password);

	// Check if username and password are provided
	if (!username || !password) {
		return res.status(400).json({ message: 'Username and password are required' });
	}

	// Check if user already exists
	const userExists = users.find(user => user.username === username);
	if (userExists) {
		return res.status(400).json({ message: 'User already exists' });
	}

	try {
		const hashedPassword = bcrypt.hashSync(password, 8);

		// Create new user with role (default to 'volunteer' if role isn't provided)
		const newUser = { username, password: hashedPassword, role: role || 'volunteer' };
		users.push(newUser);

		return res.status(201).json({ message: 'User registered successfully' });

	} catch (error) {
		console.error('Error in register function:', error);
		return res.status(500).json({ message: 'Server error during registration' });
	}
};

/* VOLUNTEER USER LOGIN */
exports.login = (req, res) => {
	const { username, password } = req.body;

	// Find user by username
	const user = users.find(user => user.username === username);
	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	// Validate password
	const validPassword = bcrypt.compareSync(password, user.password);
	if (!validPassword) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	// Create JWT token including the user role in the payload
	const token = jwt.sign(
		{ username: user.username, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: '1h' }
	);

	return res.status(200).json({ token });
};