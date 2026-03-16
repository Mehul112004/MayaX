import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getProfile } from '../Services/authService';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { isAuthenticated, isOnboarded } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    // Initial load — shows loading spinner
    useEffect(() => {
        const initialLoad = async () => {
            if (!isAuthenticated || !isOnboarded) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await getProfile();
                setProfile(response.user);
                hasFetched.current = true;
            } catch (err) {
                setError(err);
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        initialLoad();
    }, [isAuthenticated, isOnboarded]);

    // Silent refresh — does NOT set loading, so no re-render loop
    const refreshProfile = useCallback(async () => {
        if (!isAuthenticated || !isOnboarded) return;

        try {
            const response = await getProfile();
            setProfile(response.user);
        } catch (err) {
            console.error("Failed to refresh profile", err);
        }
    }, [isAuthenticated, isOnboarded]);

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
