// Define routes for user-related operations

import express from 'express';
import user from '../controllers/user.server.controller.js';
// import game from '../controllers/game.server.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/logout', user.logout);

// Protected route
router.get('/info', authMiddleware, user.getInfo);

// User collection routes (protected)
router.get('/games', authMiddleware, user.getCollection);
router.post('/games', authMiddleware, user.addToCollection);
router.delete('/games/:gameId', authMiddleware, user.removeFromCollection);

export default router;

