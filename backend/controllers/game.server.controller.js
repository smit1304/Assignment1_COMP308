// backend/controllers/game.server.controller.js
const Game = require('mongoose').model('Game');
const User = require('mongoose').model('User');

// List all games in the system [Requirement: List all available games]
exports.listAll = async (req, res) => {
    try {
        const games = await Game.find({});
        res.status(200).json(games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a game in the system (Admin/General tool)
exports.create = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Add a game to a User's personal collection [Requirement: Add games]
exports.addToUserCollection = async (req, res) => {
    try {
        const { gameId } = req.body; // Frontend only sends gameId now
        
        // Use req.user.id from the auth middleware
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $addToSet: { games: gameId } }, 
            { new: true }
        ).populate('games');
        
        res.status(200).json(user.games);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get current user's collection [Requirement: Display game details in user's collection]
exports.getUserCollection = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('games');
        res.status(200).json(user.games);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Remove game from user's collection [Requirement: Remove games]
exports.removeFromCollection = async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { games: gameId } },
            { new: true }
        ).populate('games');
        
        res.status(200).json({ message: "Game removed", collection: user.games });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get a single game by ID [Requirement: Display game details]
exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId);
        if (!game) return res.status(404).json({ error: "Game not found" });
        res.status(200).json(game);
    } catch (err) {
        res.status(400).json({ error: "Invalid Game ID" });
    }
};

// Update a game
exports.updateGame = async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(
            req.params.gameId, 
            req.body, 
            { new: true } // Return the updated document
        );
        if (!game) return res.status(404).json({ error: "Game not found" });
        res.status(200).json(game);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};