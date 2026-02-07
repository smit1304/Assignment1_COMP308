import api from '../../services/api';

const getAllGames = () => {
    return api.get('/games');
};

const getGameById = (id) => {
    return api.get(`/games/${id}`);
};

const createGame = (gameData) => {
    return api.post('/admin/games', gameData);
};

const updateGame = (id, gameData) => {
    return api.put(`/admin/games/${id}`, gameData);
};

const deleteGame = (id) => {
    return api.delete(`/admin/games/${id}`);
};

const getMyCollection = () => {
    return api.get('/users/me/games');
};

const addToCollection = (gameId) => {
    return api.post(`/users/games/${gameId}`);
};

const removeFromCollection = (gameId) => {
    return api.delete(`/users/games/${gameId}`);
};

export default {
    getAllGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
    getMyCollection,
    addToCollection,
    removeFromCollection
};
