import React, { useState } from 'react';
import Button from '../../components/common/Button';
import useAdminGames from '../../hooks/useAdminGames';
import GameListTable from './components/GameListTable';
import GameForm from './components/GameForm';

const AdminDashboard = () => {
    const { games, createGame, updateGame, deleteGame } = useAdminGames();
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'
    const [editingGame, setEditingGame] = useState(null);

    const handleCreate = async (data) => {
        const success = await createGame(data);
        if (success) {
            setActiveTab('list');
        }
    };

    const handleUpdate = async (data) => {
        const success = await updateGame(editingGame._id, data);
        if (success) {
            setEditingGame(null);
            setActiveTab('list');
        }
    };

    const handleEditClick = (game) => {
        setEditingGame(game);
        setActiveTab('form');
    };

    const handleCancel = () => {
        setEditingGame(null);
        setActiveTab('list');
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
                            setEditingGame(null);
                            setActiveTab('form');
                        }} 
                        variant={activeTab === 'form' ? 'primary' : 'secondary'}
                    >
                        + Add New Game
                    </Button>
                </div>
            </div>
            
            {activeTab === 'form' && (
                <GameForm 
                    initialData={editingGame} 
                    onSubmit={editingGame ? handleUpdate : handleCreate}
                    onCancel={handleCancel}
                />
            )}

            {activeTab === 'list' && (
                <GameListTable 
                    games={games} 
                    onEdit={handleEditClick} 
                    onDelete={deleteGame} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;
