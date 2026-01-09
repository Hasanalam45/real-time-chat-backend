/**
 * Express Application Setup
 * Configures Express app with middleware and routes
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './config/env.config.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import groupRoutes from './routes/group.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

/**
 * Create and configure Express application
 * @param {Object} app - Express app instance (from socket.js)
 * @returns {Object} Configured Express app
 */
export const createApp = (app) => {
    // CORS configuration

    const fixedCors = `https://${config.cors.origin}`;
    app.use(
        cors({
            origin: fixedCors,
            credentials: config.cors.credentials,
        })
    );

    // Body parsing middleware
    app.use(cookieParser());
    app.use(express.json({ limit: config.app.jsonLimit }));

    // Health check route
    app.get('/', (req, res) => {
        res.json({
            status: 'ok',
            message: 'Server is running',
            timestamp: new Date().toISOString(),
        });
    });

    // API routes
    app.use('/api/auth', authRoutes);
    app.use('/api/message', messageRoutes);
    app.use('/api/group', groupRoutes);

    // 404 handler (must be after all routes)
    app.use(notFoundHandler);

    // Error handling middleware (must be last)
    app.use(errorHandler);

    return app;
};

