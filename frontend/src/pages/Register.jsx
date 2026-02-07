import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
    const { register } = useAuth(); // Actually we need to add register to context or call api directly
    // Let's call API directly here for simplicity or expose it in context
    const navigate = useNavigate();
    const { login } = useAuth(); // Auto login after register?
    const [error, setError] = useState('');

    // Accessing authAPI directly since context wrapper usually handles just "login/user state"
    // But better to keep logic in page controller
    const { authAPI } = require('../services/api'); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authAPI.register(formData);
            await login({ username: formData.username, password: formData.password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Role (For Demo Only)</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default Register;