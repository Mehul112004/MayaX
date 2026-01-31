import api from './api';
import { DESIGNS } from '../Utils/mockData';

// Mock adapter or interceptor could be used, but for simplicity we'll just return a promise with mock data
// simulating an API call structure.

export const fetchDesigns = async () => {
    // Simulate API delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: DESIGNS });
        }, 1000);
    });

    // In a real scenario:
    // return api.get('/designs');
};
