import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import gameService from '../services/gameService';

const useAdminGames = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadGames = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await gameService.getAllGames();
            setGames(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load games.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGames();
    }, [loadGames]);

    const createGame = async (gameData) => {
        try {
            await gameService.createGame(gameData);
            toast.success('Game created successfully!');
            loadGames();
            return true;
        } catch (err) {
            console.error(err);
            toast.error('Failed to create game.');
            return false;
        }
    };

    const updateGame = async (id, gameData) => {
        try {
            await gameService.updateGame(id, gameData);
            toast.success('Game updated successfully!');
            loadGames();
            return true;
        } catch (err) {
            console.error(err);
            toast.error('Failed to update game.');
            return false;
        }
    };

    const deleteGame = async (id) => {
        if (!window.confirm('Are you sure you want to delete this game?')) return;
        
        try {
            await gameService.deleteGame(id);
            toast.success('Game deleted successfully');
            setGames(prev => prev.filter(g => g._id !== id));
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete game.');
        }
    };

    return { games, loading, loadGames, createGame, updateGame, deleteGame };
};

export default useAdminGames;
