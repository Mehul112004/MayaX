import api from './api';

export const fetchForYouFeed = async () => {
    try {
        const response = await api.get('/feed/foryou');
        return response.data;
    } catch (error) {
        console.error("Error fetching feed:", error);
        throw error;
    }
};
