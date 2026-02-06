// Definng the controller functions for game-related operations

import Game from '../models/game.server.model.js';
import User from '../models/user.server.model.js';


// List all games
listAllGames = async (req, res) => {
    try {
        const games = await Game.find({});
        res.status(200).json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching games', details: err.message });
    }
};

// Create a game
createGame = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create game', details: err.message });
    }
};

// Add a game to a User's personal collection
addGameToUserCollection = async (req, res) => {
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
getUserCollection = async (req, res) => {
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
removeFromCollection = async (req, res) => {
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

// Get a single game by ID
getGameById = async (req, res) => {
    try {
        const { gameId } = req.params;
        if (!gameId) return res.status(400).json({ error: 'gameId is required' });

        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ error: "Game not found" });

        res.status(200).json(game);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid game ID', details: err.message });
    }
};

// Update a game
updateGame = async (req, res) => {
    try {

        const { gameId } = req.params;
        if (!gameId) return res.status(400).json({ error: 'gameId is required' });

        const game = await Game.findByIdAndUpdate(gameId, req.body, { new: true });
        if (!game) return res.status(404).json({ error: 'Game not found' });

        res.status(200).json(game);
    } catch (err) {
        reconsole.error(err);
        res.status(400).json({ error: 'Failed to Update the Game', details: err.message });
    }
};

export {
  listAll,
  create,
  addToUserCollection,
  getUserCollection,
  removeFromCollection,
  getGameById,
  updateGame
};