// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (req, res, next) => {
    // Read the token from the HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, config.secretKey);
        // Add the user ID from the token to the request object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};