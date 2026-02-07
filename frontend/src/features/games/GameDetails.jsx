import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameService from './gameService';
import { useAuth } from '../../context/AuthContext';

const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const { data } = await gameService.getGameById(id);
                setGame(data);
            } catch (err) {
                console.error(err);
                navigate('/games'); // Redirect if not found
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!game) return <div>Game not found</div>;

    return (
        <div className="game-details">
            <h1>{game.title}</h1>
            <div className="game-info">
                <p><strong>Genre:</strong> {game.genre}</p>
                <p><strong>Platform:</strong> {game.platform}</p>
                <p><strong>Release Year:</strong> {game.releaseYear}</p>
                <p><strong>Developer:</strong> {game.developer}</p>
                <p><strong>Rating:</strong> {game.rating}/5</p>
                <p><strong>Description:</strong></p>
                <p className="description">{game.description}</p>
            </div>
            <button onClick={() => navigate(-1)} className="back-btn">Back to Library</button>
        </div>
    );
};

export default GameDetails;
