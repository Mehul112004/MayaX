import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logIn, signUp } from '../Services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on app launch
    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedToken = await SecureStore.getItemAsync('auth_token');
                const savedUser = await SecureStore.getItemAsync('auth_user');

                if (savedToken && savedUser) {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                }
            } catch (e) {
                console.log('Failed to load session:', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadSession();
    }, []);

    const _saveSession = async (newToken, newUser) => {
        await SecureStore.setItemAsync('auth_token', newToken);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const signIn = async (email, password) => {
        const result = await logIn(email, password);
        await _saveSession(result.token, result.user);
        return result;
    };

    const register = async (email, password) => {
        const result = await signUp(email, password);
        await _saveSession(result.token, result.user);
        return result;
    };

    const updateUser = async (updatedUser) => {
        setUser(updatedUser);
        await SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser));
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('auth_token');
            await SecureStore.deleteItemAsync('auth_user');
        } catch (e) {
            // ignore
        }
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token,
                isOnboarded: user?.is_onboarded ?? false,
                signIn,
                register,
                signOut,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
