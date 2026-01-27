// backend/models/user.server.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    username: { 
        type: String, 
        unique: true, 
        required: 'Username is required',
        trim: true 
    }, 
    password: { 
        type: String, 
        required: 'Password is required' 
    }, 
    // Array of Game ObjectIDs for the user's collection [cite: 70, 71]
    games: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Game' 
    }]
});

// Pre-save hook to hash passwords before saving to DB
UserSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

mongoose.model('User', UserSchema);