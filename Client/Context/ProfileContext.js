import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../Services/authService';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { isAuthenticated, isOnboarded } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProfile = useCallback(async () => {
        if (!isAuthenticated || !isOnboarded) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getProfile();
            setProfile(response.user);
        } catch (err) {
            setError(err);
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, isOnboarded]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const refreshProfile = () => loadProfile();

    return (
        <ProfileContext.Provider value={{ profile, loading, error, refreshProfile }}>
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
