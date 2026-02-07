import Game from '../models/game.server.model.js';

const getAllGames = async () => {
    return await Game.find().sort({ createdAt: -1 });
};

const getGameById = async (gameId) => {
    const game = await Game.findById(gameId);
    if (!game) {
        throw { status: 404, message: 'Game not found' };
    }
    return game;
};

const createGame = async (gameData) => {
    const game = new Game(gameData);
    await game.save();
    return game;
};

const updateGame = async (gameId, updateData) => {
    const game = await Game.findByIdAndUpdate(gameId, updateData, { new: true, runValidators: true });
    if (!game) {
        throw { status: 404, message: 'Game not found' };
    }
    return game;
};

const deleteGame = async (gameId) => {
    const game = await Game.findByIdAndDelete(gameId);
    if (!game) {
        throw { status: 404, message: 'Game not found' };
    }
    return { message: 'Game deleted successfully' };
};

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
};
