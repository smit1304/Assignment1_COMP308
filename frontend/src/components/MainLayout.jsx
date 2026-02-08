import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../features/three/AnimatedBackground';
import Button from '../components/common/Button';

// Main application layout with navigation and background
const MainLayout = () => {
    const { user, logout } = useAuth(); // Auth state and logout action
    const navigate = useNavigate();

    // Handles logout and redirects to login page
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* Three.js animated background */}
            <AnimatedBackground />

            {/* Top navigation bar */}
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img
                            src="/Game_Lib_Logo.png"
                            alt="GameLib Logo"
                            className="logo-img"
                        />
                    </Link>
                </div>

                <div className="nav-links">
                    {/* Common navigation */}
                    <Link to="/">Library</Link>

                    {user ? (
                        <>
                            {/* User-only navigation */}
                            {user.role !== 'admin' && (
                                <Link to="/collection">My Collection</Link>
                            )}

                            {/* Admin-only navigation */}
                            {user.role === 'admin' && (
                                <Link to="/admin">Admin Dashboard</Link>
                            )}

                            {/* Logged-in user info */}
                            <span className="user-greeting">
                                Hi, {user.username}
                            </span>

                            <Button
                                onClick={handleLogout}
                                variant="secondary"
                                className="logout-btn"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Guest navigation */}
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Route content */}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
