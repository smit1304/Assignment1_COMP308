import Button from './Button'; // Import Button

// ... inside Navbar component ...
                        <Button onClick={handleLogout} variant="danger" className="logout-btn">Logout</Button>

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#2d3436', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>GameVault 3D</Link>
            <div>
                <Link to="/" style={{ margin: '0 10px' }}>Library</Link>
                
                {user ? (
                    <>
                        <Link to="/collection" style={{ margin: '0 10px' }}>My Collection</Link>
                        {user.role === 'admin' && (
                             <Link to="/admin/add" style={{ margin: '0 10px', color: '#ff7675' }}>Add Game</Link>
                        )}
                        <span style={{ margin: '0 10px', color: '#a29bfe' }}>{user.username}</span>
                        <Button onClick={handleLogout} variant="danger" className="logout-btn">Logout</Button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
                        <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;