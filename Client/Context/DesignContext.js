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

    const mockSimilarDesigns = [
        { id: '101', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop', title: 'Modern Living', price: '$1200' },
        { id: '102', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop', title: 'Cozy Corner', price: '$850' },
        { id: '103', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000&auto=format&fit=crop', title: 'Elegant Space', price: '$2100' },
        { id: '104', image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2000&auto=format&fit=crop', title: 'Minimalist', price: '$950' },
    ];

    return (
        <DesignContext.Provider value={{ designs, loading, error, mockEditOptions, mockSimilarDesigns }}>
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
