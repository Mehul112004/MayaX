import api from './api';

export const fetchDesigns = async () => {
    const response = await api.get('/design/');
    return response;
};
