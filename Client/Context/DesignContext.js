import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDesigns } from '../Services/designService';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDesigns = async () => {
            try {
                setLoading(true);
                const response = await fetchDesigns();
                setDesigns(response.data);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch designs", err);
            } finally {
                setLoading(false);
            }
        };

        loadDesigns();
    }, []);

    return (
        <DesignContext.Provider value={{ designs, loading, error }}>
            {children}
        </DesignContext.Provider>
    );
};

export const useDesigns = () => {
    const context = useContext(DesignContext);
    if (!context) {
        throw new Error('useDesigns must be used within a DesignProvider');
    }
    return context;
};
