// Define user-related controller functions (e.g., register, login)

import User from '../models/user.server.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

// Helper function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, config.jwtSecret, { expiresIn: '1d' });
};


// Register a new user
const register = async (req, res) => {
    try {
        const {username, password, role} =  req.body;

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
        const user = await User.create({ username, password, role: role || 'user'});

        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });

        res.status(201).json({
        message: 'User registered successfully',
        userId: user._id,
        username: user.username,
        role: user.role
    });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register user', details: err.message });
    }
};

// Login user
const login = async (req, res) => {
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
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
};

// Get Authenticated user's info
const getInfo = async (req, res) => {
    try{
        // req.user is set by auth middleware
        const user = await User.findById(req.user.id).select('password').populate('games', '-__v');
        
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

// Users Game Collection Management

// Add a game to a User's personal collection
const addToCollection = async (req, res) => {
    try {
        const { gameId } = req.body;
        if(!gameId) {
            return res.status(400).json({ error: "Game ID is required" });
        }
        
        // Use req.user.id from the auth middleware
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $addToSet: { games: gameId } }, 
            { new: true }
        ).populate('games', '-__v');
        
        res.status(200).json(user.games);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to add game to collection', details: err.message });
    }
};

// Get current user's collection
const getCollection = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('games', '-__v');
        if(!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user.games);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to fetch user collection', details: err.message });
    }
};

// Remove game from user's collection
const removeFromCollection = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) return res.status(400).json({ error: 'gameId is required' });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { games: gameId } },
            { new: true }
        ).populate('games', '-__v');
        
        res.status(200).json({ message: "Game removed", collection: user.games });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to remove game from collection', details: err.message });
    }
};

export default {
    register,
    login,
    logout,
    getInfo,
    getCollection,
    addToCollection,
    removeFromCollection,
};