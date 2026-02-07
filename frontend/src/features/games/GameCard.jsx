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
            {game.imageUrl && (
                <img 
                    src={`${BASE_URL}${game.imageUrl}`} 
                    alt={game.title} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '1rem' }} 
                />
            )}
            <h3>{game.title}</h3>
            <p className="genre">{game.genre}</p>
            <p className="platform">{game.platform}</p>
            <div className="actions" style={{ justifyContent: user && user.role === 'admin' ? 'center' : 'space-between' }}>
                <Link 
                    to={user ? `/games/${game._id}` : '/login'} 
                    className="details-btn"
                    style={{ flex: user && user.role === 'admin' ? '0 1 50%' : '1' }}
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
