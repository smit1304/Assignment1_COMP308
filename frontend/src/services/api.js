import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Should match with the backend api
  withCredentials: true, // Enables sending/receiving httpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;