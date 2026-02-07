import api from './api';

const gameService = {
//   List all available games in the library
  getAllGames: async () => {
    try{
        const response = await api.get('/games');
        return response.data;
    } catch(error){
        throw error.response?.data || error.message;
    }  
  }
};

export default gameService;