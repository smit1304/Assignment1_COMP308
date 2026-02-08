import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import ThreeGameCard from '../../components/three/ThreeGameCard';

const GameCard = ({ game, onAdd, onRemove, inCollection }) => {
    const { user } = useAuth();
    const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';

    const handleAction = (action) => {
        if (!user) {
            window.location.href = '/login'; 
            return;
        }
        action();
    };

    const imageUrl = game.imageUrl ? `${BASE_URL}${game.imageUrl}` : null;

    return (
        <div className="game-card">
            {/* 3D Game Cover Area */}
            <div className="game-image-container">
                 {imageUrl ? (
                    <ThreeGameCard imageUrl={imageUrl} />
                ) : (
                    <span className="game-image-placeholder">🎮</span>
                )}
            </div>
            
            {/* Text and Actions Content Area */}
            <div className="game-card-content">
                <div>
                    <h3>{game.title}</h3>
                    <p className="genre">{game.genre}</p>
                    <p className="platform">{game.platform}</p>
                </div>
                
                <div className={`actions ${user && user.role === 'admin' ? 'actions-admin' : ''}`}>
                    <Link 
                        to={user ? `/games/${game._id}` : '/login'} 
                        className={`details-btn ${user && user.role === 'admin' ? 'details-btn-admin' : ''}`}
                    >
                        Details
                    </Link>
                    
                    {(!user || user.role !== 'admin') && (
                        inCollection ? (
                            <Button onClick={() => handleAction(() => onRemove(game._id))} variant="danger" className="btn-block">Remove</Button>
                        ) : (
                            <Button onClick={() => handleAction(() => onAdd(game._id))} variant="primary" className="btn-block">Add</Button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameCard;
