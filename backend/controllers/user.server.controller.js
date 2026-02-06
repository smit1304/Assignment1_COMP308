// Define user-related controller functions (e.g., register, login)

import User from '../models/user.server.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config.js';

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, config.secretKey, { expiresIn: '1d' });
};


// Register a new user
const registerUser = async (req, res) => {
    try {
        const {username, password} =  req.body;

        // Basic validation
        if(!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Create new user
        const user = await User.create({ username, password });
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });

        res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        username: user.username
    });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user', details: err.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try{

        const {username, password} = req.body;

        // Basic validation
        if(!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });

        res.status(200).json({
            message: 'Login successful',
            userId: user._id,
            username: user.username
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
}

// Logout user
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

// Get Authenticated user's info
const getUserInfo = async (req, res) => {
    try{
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id).select('-password').populate('games', '-__v');
        
        if(!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            userId: user._id,
            username: user.username,
            games: user.games
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user info', details: err.message });
    };
}


export default {
    registerUser,
    loginUser,
    logoutUser,
    getUserInfo
};