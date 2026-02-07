import React, { useEffect, useState } from 'react';
import { collectionAPI } from '../services/api';
import '../styles/games.css';

const MyCollection = () => {
    const [collection, setCollection] = useState([]);

    useEffect(() => {
        const loadCollection = async () => {
            try {
                const { data } = await collectionAPI.get();
                setCollection(data);
            } catch (err) {
                console.error("Error loading collection");
            }
        };
        loadCollection();
    }, []);

    const handleRemove = async (gameId) => {
        try {
            await collectionAPI.remove(gameId);
            setCollection(collection.filter(g => g._id !== gameId));
        } catch (err) {
            alert("Failed to remove game");
        }
    };

    return (
        <div className="container">
            <h2>My Game Collection</h2>
            {collection.length === 0 ? <p>Your collection is empty.</p> : (
                <div className="game-grid">
                    {collection.map(game => (
                        <div key={game._id} className="game-card" style={{ borderColor: '#00cec9' }}>
                            <h3>{game.title}</h3>
                            <p>{game.description}</p>
                            <small>Released: {game.releaseYear}</small>
                            <br /><br />
                            <button 
                                className="btn btn-danger"
                                onClick={() => handleRemove(game._id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCollection;