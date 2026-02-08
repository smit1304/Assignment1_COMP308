import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gameService from '../../services/gameService';
import GameCard from './GameCard';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';

// Displays list of games; supports searching, filtering, and adding/removing from collection
const GameList = (props) => {
    const [games, setGames] = useState([]);         // All games
    const [myGames, setMyGames] = useState([]);     // User's collection
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    // Fetch games on mount
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

    // Add game to user's collection
    const handleAdd = async (id) => {
        if (!user) return alert('Please login first');
        try {
            await gameService.addToCollection(id);
            setMyGames([...myGames, id]);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add game');
        }
    };

    // Remove game from user's collection
    const handleRemove = async (id) => {
        try {
            await gameService.removeFromCollection(id);
            setMyGames(myGames.filter(gId => gId !== id));
        } catch (err) {
            console.error(err);
        }
    };

    // Filter games based on search term and view type
    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              game.genre.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (props.view === 'collection') {
            return matchesSearch && myGames.includes(game._id);
        }
        return matchesSearch;
    });

    if (loading) return <div>Loading...</div>;

    return (
        <div className="game-library">
            {/* Header with admin add button */}
            <div className="library-header">
                <h2>Game Library</h2>
                {user && user.role === 'admin' && (
                    <Link to="/admin" className="admin-add-btn">
                        + Add New Game
                    </Link>
                )}
            </div>
            
            {/* Search input */}
            <SearchBar 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search games by title or genre..."
            />
            
            {/* Grid of game cards */}
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
