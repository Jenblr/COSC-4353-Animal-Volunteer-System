/* 'authService.js' file:
- Uses secret key from environment variables (.env)
- Handles business logic
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sample users array to simulate a database
const users = [
    {
        username: 'admin@example.com',
        password: bcrypt.hashSync('adminpassword', 8),
        role: 'admin'
    }
];

// Registration for volunteer users 
exports.registerUser = (username, password, role) => {
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        throw new Error('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hashedPassword, role: role || 'volunteer' };
    users.push(newUser);

    return newUser;
};

// Login for both volunteer and admin
exports.loginUser = (username, password) => {
    const user = users.find(user => user.username === username);
    if (!user) {
        throw new Error('User not found');
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return token;
};