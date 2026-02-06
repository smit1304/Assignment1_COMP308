// Centralized configuration for the application, including environment variables and default values.

import 'dotenv/config';

const config = {
    env: process.env.NODE_ENV || 'development', // Environment (development, production, etc.)
    port: process.env.PORT || 3000, // Server port
    jwtSecret: process.env.JWT_SECRET || "Your_Secret_Key", // Secret key for JWT
    mongoDBUri: process.env.MONGODB_URI || "mongodb://localhost:27017/gameLibraryDB" // DB connection string
}

export default config;