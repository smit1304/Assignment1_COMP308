// Definng the controller functions for game-related operations

import Game from '../models/game.server.model.js';

// List all games
const listAll = async (req, res) => {
    try {
        const games = await Game.find({});
        res.status(200).json(games);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while fetching games', details: err.message });
    }
};

// Create a game
const create = async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Failed to create game', details: err.message });
    }
};


// Update a game
const update = async (req, res) => {
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


// Get a game by ID
const getById = async (req, res) => {
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

export default {
  listAll,
  create,
  update,
  getById,
};