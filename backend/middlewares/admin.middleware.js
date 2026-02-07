import User from '../models/user.server.model.js';

const adminMiddleware = async (req, res, next) => {
    try {
        // req.user is already set by authMiddleware
        const user = await User.findById(req.user.id);
        
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server Error in Admin Check' });
    }
};

export default adminMiddleware;