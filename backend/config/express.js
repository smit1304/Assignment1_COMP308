// Sets up logging, security, and parsing JSON data before reaching their routes.

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';


// Routes
import userRoutes from '../routes/user.server.routes.js';
import gameRoutes from '../routes/game.server.routes.js';

const configureExpress = () => {
    const app = express();

    // Middleware: Tools required before handling a request
    // Logging (dev only)
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Core middleware
    app.use(express.json()); // Parse JSON data
    app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
    app.use(cookieParser()); // Parse cookies
    
    // CORS : Allows React to talk to backend
    app.use(
        cors({ 
            origin: process.env.FRONTEND_URL, 
            credentials: true 
        })
    );

    // Mount routes
    app.use('/api/users', userRoutes)
    app.use('/api/games', gameRoutes)

    // Global error handler (catches errors from routes)
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
            message: err.message || 'Internal Server Error'
        })
    })

    return app;
}

export default configureExpress;