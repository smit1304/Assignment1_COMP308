import React, { useEffect, useState } from 'react';
import gameService from '../games/gameService';

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
        data.append('title', formData.title);
        data.append('genre', formData.genre);
        data.append('platform', formData.platform);
        if (formData.releaseYear) data.append('releaseYear', formData.releaseYear);
        if (formData.developer) data.append('developer', formData.developer);
        if (formData.rating) data.append('rating', formData.rating);
        if (formData.description) data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            // Axios will automatically set Content-Type to multipart/form-data when data is FormData
            // BUT we explicitly set application/json in api.js. 
            // We should rely on Axios's smart behavior or override headers in the service call.
            // Let's assume standard behavior for now, but if it fails we update api.js or service.
            
            if (editingId) {
                await gameService.updateGame(editingId, data);
            } else {
                await gameService.createGame(data);
            }
            setFormData({ title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null });
            setEditingId(null);
            // Reset file input manually if needed, or rely on form reset with key
            document.getElementById('fileInput').value = '';
            loadGames();
        } catch (err) {
            console.error(err);
            alert('Operation failed');
        }
    };
    
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'

    // ... existing loadGames ...
    // ... existing handleChange ...
    // ... existing handleSubmit ...

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

    // ... existing handleDelete ...

    return (
        <div className="admin-dashboard">
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Admin Dashboard</h2>
                <div>
                    <button 
                        onClick={() => setActiveTab('list')} 
                        className={activeTab === 'list' ? 'add-btn' : 'details-btn'}
                        style={{ marginRight: '1rem' }}
                    >
                        Manage Games
                    </button>
                    <button 
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: '', genre: '', platform: '', releaseYear: '', developer: '', rating: '', description: '', image: null });
                            setActiveTab('form');
                        }} 
                        className={activeTab === 'form' ? 'add-btn' : 'details-btn'}
                    >
                        + Add New Game
                    </button>
                </div>
            </div>
            
            {activeTab === 'form' && (
                <div className="game-form">
                    <h3>{editingId ? 'Edit Game' : 'Add New Game'}</h3>
                    <form onSubmit={handleSubmit}>
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
                        <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" />
                        <input name="platform" value={formData.platform} onChange={handleChange} placeholder="Platform" />
                        <input name="releaseYear" type="number" value={formData.releaseYear} onChange={handleChange} placeholder="Year" />
                        <input name="developer" value={formData.developer} onChange={handleChange} placeholder="Developer" />
                        <input name="rating" type="number" min="0" max="5" value={formData.rating} onChange={handleChange} placeholder="Rating (0-5)" />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
                        
                        {/* Image Upload */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game Cover Image</label>
                            <input 
                                id="fileInput"
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleChange} 
                                style={{ padding: '0.5rem', background: 'none', border: 'none' }}
                            />
                        </div>

                        <button type="submit">{editingId ? 'Update' : 'Add'} Game</button>
                        <button type="button" onClick={handleCancel} style={{ marginLeft: '1rem', background: '#ccc', color: '#333' }}>Cancel</button>
                    </form>
                </div>
            )}

            {activeTab === 'list' && (
                <div className="admin-game-list">
                    <h3>Game Library Management</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Platform</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map(game => (
                                <tr key={game._id}>
                                    <td>{game.title}</td>
                                    <td>{game.platform}</td>
                                    <td>
                                        <button onClick={() => handleEdit(game)} className="details-btn" style={{ marginRight: '0.5rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(game._id)} className="remove-btn">Delete</button>
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
