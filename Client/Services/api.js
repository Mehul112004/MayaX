import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com', // Placeholder URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
