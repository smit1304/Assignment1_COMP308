import api from './api';

const register = (userData) => {
    return api.post('/users/register', userData);
};

const login = (credentials) => {
    return api.post('/users/login', credentials);
};

const logout = () => {
    return api.post('/users/logout');
};

const getInfo = () => {
    return api.get('/users/info');
};

export default {
    register,
    login,
    logout,
    getInfo
};
