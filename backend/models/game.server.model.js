// backend/models/game.server.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: { type: String, required: true }, 
    genre: { type: String, required: true }, 
    platform: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    developer: { type: String, required: true },
    rating: { type: Number, min: 1, max: 10 },
    description: { type: String }
});

mongoose.model('Game', GameSchema);