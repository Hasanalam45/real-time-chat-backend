/**
 * Group Routes
 * Routes for group functionality
 */

import express from 'express';
import {
    createGroup,
    getUserGroups,
    getGroup,
    updateGroup,
    addMembers,
    removeMembers,
    deleteGroup,
} from '../controllers/group.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * All group routes require authentication
 */
router.post('/create', authenticateUser, createGroup);
router.get('/', authenticateUser, getUserGroups);
router.get('/:id', authenticateUser, getGroup);
router.put('/:id', authenticateUser, updateGroup);
router.post('/:id/members', authenticateUser, addMembers);
router.delete('/:id/members', authenticateUser, removeMembers);
router.delete('/:id', authenticateUser, deleteGroup);

export default router;

