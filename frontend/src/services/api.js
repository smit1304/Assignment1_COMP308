import axios from 'axios';

const api = axios.create({
    baseURL: process.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 401) {
                console.error('Unauthorized');
            }

            console.error(`API Error ${status}`, data);
        } else {
            console.error('Network Error or Server Unreachable');
        }

        return Promise.reject(error);
    }
);

export default api;
