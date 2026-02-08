import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

// Top navigation bar with role-based links
const Navbar = () => {
    const { user, logout } = useAuth(); // Auth state and logout action
    const navigate = useNavigate();

    // Handles user logout and redirects to login page
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav
            style={{
                padding: '1rem',
                background: '#2d3436',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
                position: 'relative'
            }}
        >
            {/* App branding / home link */}
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                GameVault 3D
            </Link>

            <div>
                {/* Common navigation */}
                <Link to="/" style={{ margin: '0 10px' }}>Library</Link>

                {user ? (
                    <>
                        {/* User-only links */}
                        <Link to="/collection" style={{ margin: '0 10px' }}>
                            My Collection
                        </Link>

                        {/* Admin-only link */}
                        {user.role === 'admin' && (
                            <Link
                                to="/admin/add"
                                style={{ margin: '0 10px', color: '#ff7675' }}
                            >
                                Add Game
                            </Link>
                        )}

                        {/* Logged-in user info */}
                        <span style={{ margin: '0 10px', color: '#a29bfe' }}>
                            {user.username}
                        </span>

                        <button onClick={handleLogout} className="btn btn-danger">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Guest links */}
                        <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
                        <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
