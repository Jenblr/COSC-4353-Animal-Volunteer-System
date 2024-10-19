const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: bcrypt.hashSync('adminpassword', 8),
        role: 'admin'
    }
];
const temporaryUsers = [];
let lastUserId = 1; 

exports.registerUser = (email, password, role) => {
    const userExists = users.find(user => user.email === email) || 
                       temporaryUsers.find(user => user.email === email);
    if (userExists) {
        return { status: 400, message: 'User already exists' };
    }

    lastUserId++; 
    const hashedPassword = bcrypt.hashSync(password, 8);

    const token = crypto.randomBytes(20).toString('hex');
    const newUser = { 
        id: lastUserId, 
        email, 
        password: hashedPassword, 
        role: role || 'volunteer',
        token: token,
        createdAt: new Date()
    };
    temporaryUsers.push(newUser);

    return { 
        status: 201, 
        message: 'Temporary user created. Please complete your profile.',
        token: token,
        needsProfile: true 
    };
};

exports.verifyTemporaryUserByToken = (token) => {
    return temporaryUsers.find(user => user.token === token);
};

exports.finalizeRegistration = (userId) => {
    const tempUserIndex = temporaryUsers.findIndex(user => user.id === userId);
    if (tempUserIndex === -1) {
        return { status: 404, message: 'Temporary user not found' };
    }

    const user = temporaryUsers[tempUserIndex];
    users.push(user);
    temporaryUsers.splice(tempUserIndex, 1);

    return { status: 200, message: 'Registration finalized successfully' };
};

exports.loginUser = (email, password) => {
    console.log('Attempting login for email:', email);
    console.log('Current users:', users);

    const user = users.find(user => user.email === email);
    if (!user) {
        console.log('User not found for email:', email);
        return { status: 404, message: 'User not found' };
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        console.log('Invalid password for email:', email);
        return { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log('Login successful for email:', email);
    return { status: 200, token, role: user.role }; 
};

exports.getAllVolunteers = () => {
    return users.filter(user => user.role === 'volunteer');
};

// Helper functions for testing
exports.clearUsers = () => {
    users.length = 1; // Keep the admin user
    temporaryUsers.length = 0;
    lastUserId = 1;
};

exports.getTemporaryUsers = () => {
    return temporaryUsers;
};

exports.setTemporaryUserCreatedAt = (token, date) => {
    const user = temporaryUsers.find(u => u.token === token);
    if (user) {
        user.createdAt = date;
    }
};