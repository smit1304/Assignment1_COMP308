// Define routes for game-related operations

import express from 'express';
import games from '../controllers/game.server.controller.js';
import adminMiddleware from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public routes
router.get('/', games.listAll);
router.get('/:gameId', games.getById);

// Protected routes (for admin)
router.post('/', adminMiddleware, games.create);
router.put('/:gameId', adminMiddleware, games.update);

export default router;