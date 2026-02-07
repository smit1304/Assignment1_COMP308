import api from './api';

// Handle Auth related requests
const authService = {
  register: async (credentials) => {
    // userData = { username, password }
    try {
      const response = await api.post('/users/register', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (credentials) => {
    // credentials = { username, password }
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/users/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;