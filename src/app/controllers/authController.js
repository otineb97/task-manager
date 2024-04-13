// src/app/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Function to register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'The username is already in use' });
    }

    // Create a new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Function to log in
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    // Verify the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    // Generate authentication token with user ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Send the token and user ID to the client
    res.json({ token, userId: user._id });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to log out
exports.logout = (req, res) => {
  try {
    // Remove the session token from the client
    res.clearCookie('token');
    res.status(200).json({ message: 'Session closed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
