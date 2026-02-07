import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { gameAPI } from '../services/api';
import '../styles/forms.css';

const AdminGameForm = () => {
    const { state } = useLocation(); // Retrieve game data if editing
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: state?.game?.title || '',
        genre: state?.game?.genre || '',
        platform: state?.game?.platform || '',
        releaseYear: state?.game?.releaseYear || '',
        description: state?.game?.description || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await gameAPI.update(id, formData);
                alert("Game Updated!");
            } else {
                await gameAPI.create(formData);
                alert("Game Created!");
            }
            navigate('/');
        } catch (err) {
            alert(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div className="container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{isEdit ? 'Edit Game' : 'Add New Game'}</h2>
                <div className="form-group">
                    <label>Title</label>
                    <input name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Genre</label>
                    <input name="genre" value={formData.genre} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Platform</label>
                    <input name="platform" value={formData.platform} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Year</label>
                    <input name="releaseYear" type="number" value={formData.releaseYear} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="4"></textarea>
                </div>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default AdminGameForm;