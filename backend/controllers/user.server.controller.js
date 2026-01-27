// backend/controllers/user.server.controller.js
const User = require('mongoose').model('User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Helper function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, config.secretKey, { expiresIn: '1d' });
};

// Register a new user
exports.register = async (req, res, next) => { // Added 'next' here
    try {
        const { username, password } = req.body;
        
        // Basic validation check
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = new User({ username, password });
        await user.save();
        
        const token = createToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 }); 
        
        res.status(201).json({ 
            message: "User registered successfully", 
            userId: user._id, 
            username: user.username 
        });
    } catch (err) {
        // Instead of just res.status, we can pass the error to Express
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await require('bcryptjs').compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });

        res.status(200).json({ 
            message: "Login successful", 
            userId: user._id, 
            username: user.username 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logout user by clearing the cookie
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
};