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
const eventRoutes = require('./routes/eventRoutes');//event
const matchingRoutes = require('./routes/matchingRoutes');//matching

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

app.use('/api/auth/events', eventRoutes); // Add event routes

app.use('/api/auth/volunteer-matching', matchingRoutes); //matching routes

// Other routes (for everyone else's module) = this is our base url
// app.use('/api');

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