import express from 'express';
import user from '../controllers/user.server.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/logout', user.logout);

// Protected routes
router.get('/info', authMiddleware, user.getInfo);

// User Collection Routes
// GET /api/users/me/games -> user collection
router.get('/me/games', authMiddleware, user.getCollection);

// POST /api/users/games/:gameId -> add to collection
// Note: Controller expects req.body.gameId currently. Need to update controller or adapter.
// Let's rely on controller refactor or handle logic here: 
// Actually, I'll update the controller to check params if body is missing, or just update controller.
router.post('/games/:gameId', authMiddleware, user.addToCollection);

// DELETE /api/users/games/:gameId -> remove from collection
router.delete('/games/:gameId', authMiddleware, user.removeFromCollection);

export default router;
