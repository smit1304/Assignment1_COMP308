import jwt from 'jsonwebtoken';
import User from '../models/user.server.model.js';
import config from '../config/config.js';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        config.jwtSecret,
        { expiresIn: '1d' }
    );
};

const register = async (userData) => {
    const user = new User(userData);
    await user.save();
    return {
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        },
        token: generateToken(user)
    };
};

const login = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw { status: 401, message: 'Invalid credentials' };
    }

    return {
        user: {
            id: user._id,
            username: user.username,
            role: user.role
        },
        token: generateToken(user)
    };
};

export default {
    register,
    login
};
