/**
 * Authentication Routes
 * Routes for user authentication and profile management
 */

import express from 'express';
import {
    signup,
    login,
    logout,
    updateProfile,
    getUser,
    checkAuth,
} from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { sendSuccess } from '../utils/response.util.js';

const router = express.Router();

/**
 * Health check endpoint
 * GET /api/auth
 */
router.get('/', (req, res) => {
    sendSuccess(res, null, '/api/auth working fine');
});

/**
 * Public routes
 */
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

/**
 * Protected routes (require authentication)
 */
router.put('/update-profile', authenticateUser, updateProfile);
router.get('/user-info', authenticateUser, getUser);
router.get('/check-auth', authenticateUser, checkAuth);

export default router;

