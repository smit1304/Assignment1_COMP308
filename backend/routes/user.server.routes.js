// Define routes for user-related operations

import express from 'express';
import users from '../controllers/user.server.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', users.register);
router.post('/login', users.login);
router.post('/logout', users.logout);

// Protected route
router.get('/me', authMiddleware, users.getInfo);

export default router;

