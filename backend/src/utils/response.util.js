/**
 * Response Utility
 * Standardized response helper for consistent API responses
 */

import { HTTP_STATUS } from '../config/constants.js';

/**
 * Send standardized JSON response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} error - Whether this is an error response
 * @param {*} data - Response data (null for errors)
 * @param {string} message - Response message
 */
export const sendResponse = (res, statusCode, error, data, message) => {
    res.status(statusCode).json({
        error,
        message,
        data,
    });
};

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
    sendResponse(res, statusCode, false, data, message);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} data - Additional error data (optional)
 */
export const sendError = (res, message = 'An error occurred', statusCode = HTTP_STATUS.BAD_REQUEST, data = null) => {
    sendResponse(res, statusCode, true, data, message);
};

/**
 * Send unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
    sendResponse(res, HTTP_STATUS.UNAUTHORIZED, true, null, message);
};

/**
 * Send not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendNotFound = (res, message = 'Resource not found') => {
    sendResponse(res, HTTP_STATUS.NOT_FOUND, true, null, message);
};

/**
 * Send internal server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendInternalError = (res, message = 'Internal server error') => {
    sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, true, null, message);
};

