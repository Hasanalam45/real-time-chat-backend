/**
 * Application Entry Point
 * Initializes and starts the server
 */

import { app, server } from './lib/socket.js';
import { connectDb } from './lib/database.js';
import { createApp } from './app.js';
import { config } from './config/env.config.js';

/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Initialize Express app with middleware and routes
        createApp(app);

        // Connect to database
        await connectDb();

        // Start HTTP server
        server.listen(config.server.port, () => {
            console.log(`🚀 Server is running on port ${config.server.port}`);
            console.log(`🌍 Environment: ${config.server.nodeEnv}`);
            console.log(`📍 Health check: http://localhost:${config.server.port}/`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the application
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    if (config.server.nodeEnv === 'production') {
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

