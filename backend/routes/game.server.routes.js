// Define routes for game-related operations

import express from 'express';
import games from '../controllers/game.server.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', games.listAll);
router.post('/', games.create);
router.get('/:gameId', games.getById);

// Protected routes
router.put('/:gameId', authMiddleware, games.update);

// User collection routes (protected)
router.get('/user/collection', authMiddleware, games.getUserCollection);
router.post('/user/games', authMiddleware, games.addToUserCollection);
router.delete('/user/games/:gameId', authMiddleware, games.removeFromCollection);

export default router;