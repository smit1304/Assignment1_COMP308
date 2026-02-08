import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Authentication context
const AuthContext = createContext();

// Custom hook for accessing auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider to manage user state globally
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);     // Logged-in user data
    const [loading, setLoading] = useState(true); // Auth loading state

    // Check existing auth session on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await authService.getInfo();
                setUser(data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login and set user data
    const login = async (credentials) => {
        const { data } = await authService.login(credentials);
        setUser(data);
    };

    // Logout and clear user state
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
