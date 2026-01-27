// backend/server.js
const config = require('./config/config');
const mongoose = require('./config/mongoose');
const express = require('express');
const cors = require('cors');

// Initialize Mongoose connection
const db = mongoose();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Load Models (Requirement: Correct models and config files) [cite: 88]
require('./models/game.server.model');
require('./models/user.server.model');

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});

module.exports = app;