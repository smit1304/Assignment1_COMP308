// backend/config/mongoose.js
const mongoose = require('mongoose');
const config = require('./config');

module.exports = function() {
    mongoose.connect(config.mongoUri)
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => console.error('MongoDB connection error:', err));
    
    return mongoose.connection;
};