import api from './api';

/**
 * Fetch the current user's projects.
 * @returns {{ data: Array<{ id, title, description, image_url, room_type, style, created_at }> }}
 */
export const fetchUserProjects = async () => {
    const response = await api.get('/user/projects');
    return response.data;
};

/**
 * Fetch the current user's inspirations (liked projects from other users).
 * @returns {{ data: Array<{ id, created_at, project: {...} }> }}
 */
export const fetchUserInspirations = async () => {
    const response = await api.get('/user/inspirations');
    return response.data;
};

/**
 * Save a project as inspiration (like).
 * @param {string} projectId
 */
export const saveInspiration = async (projectId) => {
    const response = await api.post('/user/inspirations', { project_id: projectId });
    return response.data;
};

/**
 * Remove a project from inspirations (unlike).
 * @param {string} projectId
 */
export const removeInspiration = async (projectId) => {
    const response = await api.delete(`/user/inspirations/${projectId}`);
    return response.data;
};
