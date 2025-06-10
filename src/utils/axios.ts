import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.explore-jakarta.my.id', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors can be added here if needed

export default api;