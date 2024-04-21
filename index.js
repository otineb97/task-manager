// Import necessary modules
const express = require('express');
const path = require('path');
const logger = require('morgan');
const database = require('./config/database');
const authRoutes = require('./app/routes/authRoutes');
const taskRoutes = require('./app/routes/taskRoutes');

// Create an Express app
const app = express();

// Set the port number
const PORT = process.env.PORT || 3000;

// Use the logger middleware for logging
app.use(logger('dev'));

// Parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Define routes
const renderIndex = (req, res) => res.render('index');
app.get(['/', '/index'], renderIndex);
app.get('/register', (req, res) => res.render('register'));
app.get('/tasks', (req, res) => res.render('tasks'));
app.get('/api', (req, res) => res.json({ msg: 'Task Manager' }));

// Use the authRoutes and taskRoutes middleware
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the server for testing purposes
module.exports = server;
