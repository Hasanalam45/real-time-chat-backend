/**
 * Authentication Middleware
 * Validates JWT tokens and attaches user to request object
 */

import { verifyToken } from '../utils/jwt.util.js';
import { sendUnauthorized, sendNotFound } from '../utils/response.util.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import userModel from '../models/user.model.js';

/**
 * Middleware to authenticate user via JWT token
 * Attaches authenticated user to req.user
 */
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return sendUnauthorized(res, ERROR_MESSAGES.UNAUTHORIZED);
        }

        const decoded = verifyToken(token);

        if (!decoded || !decoded.userId) {
            return sendUnauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
        }

        const user = await userModel.findById(decoded.userId).select('-password');

        if (!user) {
            return sendNotFound(res, ERROR_MESSAGES.USER_NOT_FOUND);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return sendUnauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
        }
        next(error);
    }
};

