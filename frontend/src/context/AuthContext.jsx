import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../features/auth/authService';

const AuthContext = createContext();

// --- FIX 1: Create and Export the Custom Hook ---
export const useAuth = () => useContext(AuthContext);

// --- FIX 2: Use lowercase 'children' for props ---
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const login = async (credentials) => {
        const { data } = await authService.login(credentials);
        setUser(data);
    };

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