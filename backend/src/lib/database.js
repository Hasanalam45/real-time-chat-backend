/**
 * Database Connection
 * Handles MongoDB connection using Mongoose
 */

import mongoose from 'mongoose';
import { config } from '../config/env.config.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(config.database.uri, {
            // Mongoose 6+ options (these are now defaults, but explicit for clarity)
        });

        console.log(`✅ MongoDB Connected: ${connection.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        // In production, you might want to exit the process
        if (config.server.nodeEnv === 'production') {
            process.exit(1);
        }
        throw error;
    }
};

export default connectDb;

