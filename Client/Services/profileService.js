import api from './api';

// Mock Data matching the screenshot
const MOCK_PROFILE = {
    id: '1',
    name: 'Jane Doe',
    handle: '@janedoe_designs',
    bio: 'Minimalist enthusiast | Creating calm spaces',
    avatar: 'https://i.pravatar.cc/300?img=5', // Placeholder image
    stats: {
        projects: 42,
        followers: '1.2k',
        following: 350,
    },
    projects: [
        { id: 1, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500&q=60' }, // Living room
        { id: 2, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=60' }, // Kitchen
        { id: 3, image: 'https://images.unsplash.com/photo-1616486338812-3aeee7e36f58?auto=format&fit=crop&w=500&q=60' }, // Bedroom
        { id: 4, image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=500&q=60' }, // Patio
        { id: 5, image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=500&q=60' }, // Office
        { id: 6, image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=60' }, // Dining
        { id: 7, image: 'https://images.unsplash.com/photo-1584622640111-994a426fbf0a?auto=format&fit=crop&w=500&q=60' }, // Bathroom
        { id: 8, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500&q=60' }, // Kids room
        { id: 9, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=500&q=60' }, // Closet
    ],
    inspirations: [
        { id: 10, image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=500&q=60' },
        { id: 11, image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=500&q=60' },
        { id: 12, image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=500&q=60' },
    ]
};

export const fetchProfile = async () => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: MOCK_PROFILE });
        }, 500);
    });
};
