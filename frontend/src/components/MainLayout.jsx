import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from '../features/three/AnimatedBackground';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <AnimatedBackground />
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">🎮 GameLib</Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Library</Link>
                    {user ? (
                        <>
                            {user.role !== 'admin' && <Link to="/collection">My Collection</Link>}
                            {user.role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                            <span className="user-greeting">Hi, {user.username}</span>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </nav>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
