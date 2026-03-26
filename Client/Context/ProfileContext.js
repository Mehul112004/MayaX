import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getProfile } from '../Services/authService';
import { fetchUserProjects, fetchUserInspirations } from '../Services/profileService';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { isAuthenticated, isOnboarded } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    const fetchFullProfile = async () => {
        const [profileRes, projectsRes, inspirationsRes] = await Promise.all([
            getProfile(),
            fetchUserProjects().catch(() => ({ data: [] })),
            fetchUserInspirations().catch(() => ({ data: [] })),
        ]);

        const user = profileRes.user;

        // Build projects list — use image_url for the grid
        const projects = (projectsRes.data || []).map((p) => ({
            id: p.id,
            image: p.image_url,
            title: p.title,
            ...p,
        }));

        // Build inspirations list — extract the nested project data
        const inspirations = (inspirationsRes.data || []).map((ins) => ({
            id: ins.id,
            image: ins.project?.image_url,
            title: ins.project?.title,
            project_id: ins.project?.id,
            ...ins.project,
        }));

        return {
            ...user,
            stats: user.stats || { projects: projects.length, inspirations: inspirations.length },
            projects,
            inspirations,
        };
    };

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
                const fullProfile = await fetchFullProfile();
                setProfile(fullProfile);
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
            const fullProfile = await fetchFullProfile();
            setProfile(fullProfile);
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
