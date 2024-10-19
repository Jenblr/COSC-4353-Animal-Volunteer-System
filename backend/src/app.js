require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const matchingRoutes = require('./routes/matchingRoutes');
const profileRoutes = require('./routes/profileRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express(); // Initializes Express app

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Root Route for http://localhost:5000/
app.get('/', (req, res) => {
    res.send('Animal Volunteer System Backend');
});

// Authentication Routes = User needs to be logged in to access certain routes
app.use('/api/auth', authRoutes); 
app.use('/api/notifications', notificationRoutes); 
app.use('/api/auth/events', eventRoutes); 
app.use('/api/auth/volunteer-matching', matchingRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/auth/history', historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
})

const cron = require('node-cron');
const authService = require('./services/authService');

// Run cleanup every hour
cron.schedule('0 * * * *', () => {
    authService.cleanupIncompleteRegistrations();
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
}  

module.exports = app;