import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true // Important for cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            // Optional: Dispatch logout action or clear local state if needed
            // Window.location.href = '/login'; // Be careful with this in SPA
        }
        return Promise.reject(error);
    }
);

export default api;