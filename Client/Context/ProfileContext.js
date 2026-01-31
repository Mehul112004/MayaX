import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProfile } from '../Services/profileService';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const response = await fetchProfile();
                setProfile(response.data);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, loading, error }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
