// backend/server.js
const config = require('./config/config');
const mongoose = require('./config/mongoose');
const express = require('express');
const cors = require('cors');


// Initialize Mongoose connection
const db = mongoose();

// Create Express app
const app = express();

// backend/server.js (Updated Snippet)
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // Required for HTTPOnly cookies

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Allow your Vite frontend
    credentials: true                // Allow cookies to be sent/received
}));
// Load Models (Requirement: Correct models and config files) [cite: 88]
require('./models/game.server.model');
require('./models/user.server.model');

// Load Routes
require('./routes/user.server.routes')(app);
require('./routes/game.server.routes')(app);

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});

module.exports = app;