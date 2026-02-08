import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

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

    return (
        <div className="game-card">
            <div className="game-image-container">
                {game.imageUrl ? (
                    <img 
                        src={`${BASE_URL}${game.imageUrl}`} 
                        alt={game.title} 
                        className="game-image"
                    />
                ) : (
                    <span className="game-image-placeholder">🎮</span>
                )}
            </div>
            <h3>{game.title}</h3>
            <p className="genre">{game.genre}</p>
            <p className="platform">{game.platform}</p>
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
                        <Button onClick={() => handleAction(() => onAdd(game._id))} variant="primary" className="btn-block">Add to Collection</Button>
                    )
                )}
            </div>
        </div>
    );
};

export default GameCard;
