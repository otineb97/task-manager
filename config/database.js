// Import Mongoose for MongoDB database connection
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Connect to the database using the provided URI
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error('Error connecting to the database:', err));