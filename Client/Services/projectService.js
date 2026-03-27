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

export const generateDesign = async (imageUri, prompt) => {
    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        
        formData.append('image', {
            uri: imageUri,
            name: filename,
            type
        });

        const response = await api.post('/projects/generate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 180000, // Override global 15s timeout with a 3 minute timeout
        });
        return response.data;
    } catch (error) {
        console.error('Error generating design:', error);
        throw error;
    }
};

export const saveProject = async (projectId, finalImageUrl) => {
    try {
        const response = await api.post(`/projects/${projectId}/save`, {
            final_image_url: finalImageUrl
        });
        return response.data;
    } catch (error) {
        console.error('Error saving project:', error);
        throw error;
    }
};
