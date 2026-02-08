import { useState } from 'react';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useRegisterForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register(formData);
            await login(formData); 
            navigate('/');
        } catch (err) {
            console.error('Frontend Registration Error:', err.response?.data);
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return { formData, error, handleChange, handleSubmit };
};

export default useRegisterForm;
