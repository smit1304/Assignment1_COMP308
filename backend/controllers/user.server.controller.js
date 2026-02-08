import authService from '../services/auth.service.js';
import userService from '../services/user.service.js';

const register = async (req, res) => {
    try {
        const { user, token } = await authService.register(req.body);
        
        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json(user);
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(err.status || 400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await authService.login(username, password);

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json(user);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

const getInfo = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

const getCollection = async (req, res) => {
    try {
        const games = await userService.getUserCollection(req.user.id);
        res.json(games);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

const addToCollection = async (req, res) => {
    try {
        const games = await userService.addToCollection(req.user.id, req.params.gameId);
        res.json(games);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

const removeFromCollection = async (req, res) => {
    try {
        const games = await userService.removeFromCollection(req.user.id, req.params.gameId);
        res.json(games);
    } catch (err) {
        res.status(err.status || 400).json({ error: err.message });
    }
};

export default {
    register,
    login,
    logout,
    getInfo,
    getCollection,
    addToCollection,
    removeFromCollection
};