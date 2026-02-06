// Defines the Game model using Mongoose

import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  platform: { type: String },
  releaseYear: { type: Number },
  developer: { type: String },
  rating: { type: Number },
  description: { type: String }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

export default mongoose.model('Game', GameSchema);