/**
 * Error Handling Middleware
 * Centralized error handling for the application
 */

import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { sendError, sendInternalError } from '../utils/response.util.js';

/**
 * Global error handling middleware
 * Should be used as the last middleware in the Express app
 */
export const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.UNAUTHORIZED);
    }

    // Validation errors (Joi)
    if (err.isJoi) {
        return sendError(res, err.details[0]?.message || ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message).join(', ');
        return sendError(res, messages || ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return sendError(res, `${field} already exists`, HTTP_STATUS.BAD_REQUEST);
    }

    // Default to internal server error
    sendInternalError(res, err.message || ERROR_MESSAGES.INTERNAL_ERROR);
};

/**
 * 404 Not Found handler
 * Should be used after all routes
 */
export const notFoundHandler = (req, res) => {
    sendError(res, `Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
};

