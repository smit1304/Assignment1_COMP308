import React, { useEffect, useState } from 'react';
import { gameAPI, collectionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/games.css';

const GameLibrary = () => {
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const { data } = await gameAPI.getAll();
            setGames(data);
        } catch (err) {
            console.error("Failed to load games");
        }
    };

    const handleAddToCollection = async (gameId) => {
        if (!user) return navigate('/login');
        try {
            await collectionAPI.add(gameId);
            alert("Game added to collection!");
        } catch (err) {
            alert("Error adding game (maybe it's already there?)");
        }
    };

    // Filter Logic
    const filteredGames = games.filter(g => 
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Available Games</h2>
            
            <input 
                type="text" 
                placeholder="Search games..." 
                className="form-group"
                style={{ width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="game-grid">
                {filteredGames.map(game => (
                    <div key={game._id} className="game-card">
                        <h3>{game.title}</h3>
                        <p>Genre: {game.genre}</p>
                        <p>Platform: {game.platform}</p>
                        <div style={{ marginTop: '10px' }}>
                            <button 
                                className="btn btn-primary"
                                onClick={() => handleAddToCollection(game._id)}
                            >
                                + Add to Collection
                            </button>
                            {user && user.role === 'admin' && (
                                <button 
                                    className="btn" 
                                    style={{ marginLeft: '10px', background: '#fab1a0' }}
                                    onClick={() => navigate(`/admin/edit/${game._id}`, { state: { game } })}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameLibrary;