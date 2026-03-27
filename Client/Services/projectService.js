import api from './api';

export const getProjectDetails = async (projectId) => {
    try {
        const response = await api.get(`/feed/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project details:', error);
        throw error;
    }
};

export const likeProject = async (projectId) => {
    try {
        const response = await api.post('/user/inspirations', { project_id: projectId });
        return response.data;
    } catch (error) {
        console.error('Error liking project:', error);
        throw error;
    }
};

export const unlikeProject = async (projectId) => {
    try {
        const response = await api.delete(`/user/inspirations/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error unliking project:', error);
        throw error;
    }
};
