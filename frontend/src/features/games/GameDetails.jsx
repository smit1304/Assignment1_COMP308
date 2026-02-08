import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameService from '../../services/gameService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

// Page displaying detailed information about a single game
const GameDetails = () => {
    const { id } = useParams(); // Game ID from route
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch game details on component mount
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const { data } = await gameService.getGameById(id);
                setGame(data);
            } catch (err) {
                console.error(err);
                navigate('/games'); // Redirect if game not found
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!game) return <div>Game not found</div>;

    const BASE_URL = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:4000';

    return (
        <div className="game-details">
            {/* Header with title and back button */}
            <div className="game-header">
                <h1>{game.title}</h1>
                <Button onClick={() => navigate(-1)} variant="secondary" className="back-btn">
                    Back to Library
                </Button>
            </div>
            
            {/* Main content */}
            <div className="game-content">
                {/* Game information */}
                <div className="game-info">
                    <p><strong>Genre:</strong> {game.genre}</p>
                    <p><strong>Platform:</strong> {game.platform}</p>
                    <p><strong>Release Year:</strong> {game.releaseYear}</p>
                    <p><strong>Developer:</strong> {game.developer}</p>
                    <p><strong>Rating:</strong> {game.rating}/5</p>
                    <p><strong>Description:</strong></p>
                    <p className="description">{game.description}</p>
                </div>

                {/* Game cover image */}
                <div className="game-image-column">
                    {game.imageUrl ? (
                        <img 
                            src={`${BASE_URL}${game.imageUrl}`} 
                            alt={game.title} 
                            className="detail-image"
                        />
                    ) : (
                        <div className="detail-placeholder">
                            <span>🎮</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
