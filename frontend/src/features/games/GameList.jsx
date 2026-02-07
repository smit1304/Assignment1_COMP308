import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gameService from './gameService';
import GameCard from './GameCard';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [myGames, setMyGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const [allGamesRes, myGamesRes] = await Promise.all([
                gameService.getAllGames(),
                user ? gameService.getMyCollection() : Promise.resolve({ data: [] })
            ]);
            setGames(allGamesRes.data);
            setMyGames(myGamesRes.data.map(g => g._id));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (id) => {
        if (!user) return alert('Please login first');
        try {
            await gameService.addToCollection(id);
            setMyGames([...myGames, id]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add game');
        }
    };

    const handleRemove = async (id) => {
        try {
            await gameService.removeFromCollection(id);
            setMyGames(myGames.filter(gId => gId !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="game-library">
            <div className="library-header">
                <h2>Game Library</h2>
                {user && user.role === 'admin' && (
                    <Link to="/admin" className="admin-add-btn">
                        + Add New Game
                    </Link>
                )}
            </div>
            
            <SearchBar 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games by title or genre..."
            />
            
            <div className="game-grid">
                {filteredGames.map(game => (
                    <GameCard 
                        key={game._id} 
                        game={game} 
                        inCollection={myGames.includes(game._id)}
                        onAdd={handleAdd}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameList;
