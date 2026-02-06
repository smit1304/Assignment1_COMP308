// config/mongoose.js
import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    // Allow queries to include fields not present in the Schema
    mongoose.set('strictQuery', false);

    // Connect to MongoDB using the URI from config
    try{
        const conn = await mongoose.connect(config.mongoDBUri, {
            useNewUrlParser: true, // modern mongoDB connection string parser
            useUnifiedTopology: true, // unified topology engine for better connection handling
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
}