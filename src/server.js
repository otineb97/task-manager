// src/server.js

// Module Imports
const express = require('express');
const path = require('path');
const authRoutes = require('./app/routes/authRoutes');
const taskRoutes = require('./app/routes/taskRoutes');
require('./config/database');

// Server Configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Middleware to handle JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Middleware to serve static files from the 'public' directory

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' }); // Internal Server Error message
});

// Routes
app.use('/auth', authRoutes); // Authentication routes
app.use('/tasks', taskRoutes); // Task routes

// Server Initialization
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Server running message
});
