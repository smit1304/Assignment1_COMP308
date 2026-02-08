import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import gameService from '../../services/gameService';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
    const [games, setGames] = useState([]);
    const [formData, setFormData] = useState({
        title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        const { data } = await gameService.getAllGames();
        setGames(data);
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        // ... (data fetching logic removed for brevity in replacement, but key is logic inside try/catch)
        data.append('title', formData.title);
        data.append('genre', formData.genre);
        data.append('platform', formData.platform);
        if (formData.releaseYear) data.append('releaseYear', formData.releaseYear);
        if (formData.developer) data.append('developer', formData.developer);
        if (formData.rating) data.append('rating', formData.rating);
        if (formData.description) data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingId) {
                await gameService.updateGame(editingId, data);
                toast.success('Game updated successfully!');
            } else {
                await gameService.createGame(data);
                toast.success('Game created successfully!');
            }
            setFormData({ title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null });
            setEditingId(null);
            
            document.getElementById('fileInput').value = '';
            loadGames();
        } catch (err) {
            console.error(err);
            toast.error('Operation failed. Please try again.');
        }
    };
    
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'


    const handleEdit = (game) => {
        setFormData(game);
        setEditingId(game._id);
        setActiveTab('form'); // Switch to form view
    };

    const handleCancel = () => {
        setEditingId(null); 
        setFormData({ title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null }); 
        document.getElementById('fileInput').value = '';
        setActiveTab('list');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this game?')) {
            try {
                await gameService.deleteGame(id);
                toast.success('Game deleted successfully');
                loadGames();
            } catch (err) {
                console.error("Failed to delete game", err);
                toast.error("Failed to delete game");
            }
        }
    };


    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <div className="admin-actions">
                    <Button 
                        onClick={() => setActiveTab('list')} 
                        variant={activeTab === 'list' ? 'primary' : 'secondary'}
                    >
                        Manage Games
                    </Button>
                    <Button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null });
                            setActiveTab('form');
                        }} 
                        variant={activeTab === 'form' ? 'primary' : 'secondary'}
                    >
                        + Add New Game
                    </Button>
                </div>
            </div>
            
            {activeTab === 'form' && (
                <div className="game-form">
                    <h3>{editingId ? 'Edit Game' : 'Add New Game'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                            <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" />
                            <input name="platform" value={formData.platform} onChange={handleChange} placeholder="Platform" />
                            <input name="releaseYear" type="number" value={formData.releaseYear} onChange={handleChange} placeholder="Year" />
                            <input name="developer" value={formData.developer} onChange={handleChange} placeholder="Developer" />
                            <input name="rating" type="number" min="0" max="5" value={formData.rating} onChange={handleChange} placeholder="Rating (0-5)" />
                        </div>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="4"></textarea>
                        
                        {/* Image Upload */}
                        <div className="file-upload-container">
                            <label>Game Cover Image</label>
                            <input 
                                id="fileInput"
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleChange} 
                                className="file-input"
                            />
                        </div>

                        <div className="form-actions">
                            <Button type="submit" variant="primary" className="btn-block">{editingId ? 'Update' : 'Add'} Game</Button>
                            <Button type="button" onClick={handleCancel} variant="secondary" className="btn-block">Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'list' && (
                <div className="admin-game-list">
                    <h3>Manage Games</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Platform</th>
                                <th className="action-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map(game => (
                                <tr key={game._id}>
                                    <td className="thumbnail-cell">
                                        {game.imageUrl ? (
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000'}${game.imageUrl}`} 
                                                alt={game.title} 
                                                className="game-thumbnail"
                                            />
                                        ) : (
                                            <span className="game-thumbnail-placeholder">🎮</span>
                                        )}
                                    </td>
                                    <td>{game.title}</td>
                                    <td>{game.platform}</td>
                                    <td className="action-cell">
                                        <Button onClick={() => handleEdit(game)} variant="secondary" className="edit-btn">Edit</Button>
                                        <Button onClick={() => handleDelete(game._id)} variant="danger" className="delete-btn">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
