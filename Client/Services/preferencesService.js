import api from './api';

export const getPreferenceCategories = async () => {
  try {
    const response = await api.get('/preferences/');
    return response.data;
  } catch (error) {
    console.error('Error fetching preference categories:', error);
    throw error;
  }
};
