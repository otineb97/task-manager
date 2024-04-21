const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes for user authentication
router.post('/register', authController.register); // Register new user
router.post('/login', authController.login); // Log in
router.delete('/logout', authController.logout); // Log out

module.exports = router;
