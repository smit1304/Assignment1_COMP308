import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const GameCard = ({ game, onAdd, onRemove, inCollection }) => {
    const { user } = useAuth();
    const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';
    
    // Tilt Logic
    const cardRef = React.useRef(null);
    const [tiltStyles, setTiltStyles] = React.useState({});

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Gentle tilt - max 10 degrees
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;

        setTiltStyles({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
            transition: 'transform 0.1s ease-out',
            zIndex: 10,
            boxShadow: '0 20px 30px rgba(0,0,0,0.5)'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyles({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: 'transform 0.5s ease-out',
            zIndex: 1,
            boxShadow: 'none'
        });
    };

    const handleAction = (action) => {
        if (!user) {
            window.location.href = '/login'; 
            return;
        }
        action();
    };

    return (
        <div 
            className="game-card" 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyles}
        >
            <div className="game-image-container">
                {game.imageUrl ? (
                    <img 
                        src={`${BASE_URL}${game.imageUrl}`} 
                        alt={game.title} 
                        className="game-image"
                        style={{ transform: 'translateZ(30px)' }}
                    />
                ) : (
                    <span className="game-image-placeholder">🎮</span>
                )}
            </div>
            <h3 style={{ transform: 'translateZ(20px)' }}>{game.title}</h3>
            <p className="genre" style={{ transform: 'translateZ(10px)' }}>{game.genre}</p>
            <p className="platform" style={{ transform: 'translateZ(10px)' }}>{game.platform}</p>
            <div className={`actions ${user && user.role === 'admin' ? 'actions-admin' : ''}`}>
                <Link 
                    to={user ? `/games/${game._id}` : '/login'} 
                    className={`details-btn ${user && user.role === 'admin' ? 'details-btn-admin' : ''}`}
                    style={{ transform: 'translateZ(20px)' }}
                >
                    Details
                </Link>
                
                {(!user || user.role !== 'admin') && (
                    inCollection ? (
                        <Button onClick={() => handleAction(() => onRemove(game._id))} variant="danger" className="btn-block">Remove</Button>
                    ) : (
                        <Button onClick={() => handleAction(() => onAdd(game._id))} variant="primary" className="btn-block">Add to Collection</Button>
                    )
                )}
            </div>
        </div>
    );
};

export default GameCard;
