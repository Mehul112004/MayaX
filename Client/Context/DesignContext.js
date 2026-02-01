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

    const mockEditOptions = [
        { id: '1', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop', name: 'Modern' },
        { id: '2', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2000&auto=format&fit=crop', name: 'Minimal' },
        { id: '3', image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=2000&auto=format&fit=crop', name: 'Classic' },
        { id: '4', image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=2000&auto=format&fit=crop', name: 'Boho' },
        { id: '5', image: 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=2000&auto=format&fit=crop', name: 'Industrial' },
    ];

    return (
        <DesignContext.Provider value={{ designs, loading, error, mockEditOptions }}>
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
