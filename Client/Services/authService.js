import api from './api';

/**
 * Sign up with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: object }}
 */
export const signUp = async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
};

/**
 * Log in with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ token: string, user: object }}
 */
export const logIn = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

/**
 * Complete user onboarding with profile details.
 * @param {{ name: string, phone?: string, image_base64?: string }} data
 * @returns {{ message: string, user: object }}
 */
export const completeProfile = async (data) => {
    const response = await api.post('/auth/complete-profile', data);
    return response.data;
};

/**
 * Fetch the current user's profile.
 * @returns {{ user: object }}
 */
export const getProfile = async () => {
    const response = await api.get('/user/profile');
    return response.data;
};

/**
 * Update user profile (name and/or image).
 * @param {{ name?: string, image_base64?: string }} data
 * @returns {{ message: string, user: object }}
 */
export const updateProfile = async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
};
