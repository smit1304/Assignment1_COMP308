import api from './api';

// Handle auth related requests
const authServices = {
    register: async (credentials) => {
        // userData = { username, password }
        try{
            const response = await api.post('/user/register', userData);
            return response.data;
        } catch(err) {
            throw err.response?.data || err.message;
        }
    },

    login: async (credentials) => {
        // credentials = { username, password }
        try{
            const response = await api.post('user/login', credentials)
            return response.data;
        } catch(err) {
            throw err.response?.data || err.message;
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

export default authServices;

