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
const cronManager = require('./services/cronManager');
const authService = require('./services/authService');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Root Route
app.get('/', (req, res) => {
	res.send('Animal Volunteer System Backend');
});

// Routes
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
});

// Schedule cron jobs only in non-test environment
if (process.env.NODE_ENV !== 'test') {
	cronManager.schedule(
		'cleanup-registrations',
		'0 * * * *',
		() => authService.cleanupIncompleteRegistrations()
	);
}

if (process.env.NODE_ENV !== 'test') {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

module.exports = { app, cronManager };