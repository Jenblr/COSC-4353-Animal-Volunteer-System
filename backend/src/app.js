/* 'app.js' file:
- Sets up Express server 
- Uses Middleware for JSON parsing and CORS
- Defines our routes for each module
- Starts our server on the 5000 port
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
<<<<<<< HEAD
const notificationRoutes = require('./routes/notificationRoutes');
//const eventRoutes = require('./routes/eventRoutes');
=======
>>>>>>> origin/JenniferN

const app = express(); // Initializes Express app

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Root Route for http://localhost:5000/
app.get('/', (req, res) => {
    res.send('Animal Volunteer System Backend');
});

<<<<<<< HEAD
// Authentication Routes = Registration and Login
app.use('/api/auth', authRoutes);

// Other routes (for everyone else's module) = this is our base url
app.use('/api/notifications', notificationRoutes); 
//app.use('/api/auth/events', eventRoutes); 
// app.use('/api');

=======
// Authentication Routes = User needs to be logged in to access certain routes
app.use('/api/auth', authRoutes);

>>>>>>> origin/JenniferN
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
})

// Start the server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}  

module.exports = app;