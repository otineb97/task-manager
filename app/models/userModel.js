const mongoose = require('mongoose');

// Define the schema for users
const userSchema = new mongoose.Schema({
  // Username field with type String, required, and unique
  username: {
    type: String,
    required: true,
    unique: true
  },
  // Password field with type String and required
  password: {
    type: String,
    required: true
  }
});

// Create the User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
