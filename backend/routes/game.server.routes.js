// Define routes for game-related operations

import express from 'express';
import games from '../controllers/game.server.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', games.listAll);
router.get('/:gameId', games.getById);

// Protected routes (for admin)
router.post('/',authMiddleware, games.create);
router.put('/:gameId', authMiddleware, games.update);

export default router;