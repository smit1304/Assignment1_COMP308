import api from './api';

// Handle user request to add, remove or delete a game from their collection
const userService = {

  // Used to check if user is logged in and get their data
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/info');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserLibrary: async () => {
    try {
      const response = await api.get('/users/games');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  addGameToLibrary: async (gameId) => {
    try {
      // Backend expects: { gameId: "..." } in body
      const response = await api.post('/users/games', { gameId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Matches: const removeFromCollection = async (req, res) => { ... }
  removeGameFromLibrary: async (gameId) => {
    try {
      // Backend expects gameId in params: /users/collection/:gameId
      const response = await api.delete(`/users/games/${gameId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userService;