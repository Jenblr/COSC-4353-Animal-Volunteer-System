/* 'authService.js' file:
- Uses secret key from environment variables (.env)
- Handles business logic
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sample users array to simulate a database
const users = [
    {
        id: 1,
        email: 'admin@example.com',
        password: bcrypt.hashSync('adminpassword', 8),
        role: 'admin'
    }
];

// Registration for volunteer users 
exports.registerUser = (email, password, role) => {
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return { status: 400, message: 'User already exists' };
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { id: users.length + 1, email, password: hashedPassword, role: role || 'volunteer' };
    users.push(newUser);

    return { status: 201, user: newUser };
};

// Login for both volunteer and admin
exports.loginUser = (email, password) => {
    const user = users.find(user => user.email === email);
    if (!user) {
        return { status: 404, message: 'User not found' };
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
        return { status: 401, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

<<<<<<< HEAD
    return { status: 200, token };
};
=======
    return { status: 200, token, role: user.role };
};
>>>>>>> origin/JenniferN
