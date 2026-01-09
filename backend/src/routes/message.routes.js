/**
 * Message Routes
 * Routes for messaging functionality
 */

import express from 'express';
import {
    getUsersforSidebar,
    getMessages,
    sendMessage,
} from '../controllers/message.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * All message routes require authentication
 */
router.get('/users', authenticateUser, getUsersforSidebar);
router.get('/:id', authenticateUser, getMessages);
router.post('/send/:id', authenticateUser, sendMessage);

export default router;

