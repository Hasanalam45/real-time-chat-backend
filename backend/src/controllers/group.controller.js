/**
 * Group Controller
 * Handles group-related HTTP requests
 */

import { createGroupSchema, updateGroupSchema, updateMembersSchema } from '../validators/group.validator.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';
import * as groupService from '../services/group.service.js';
import { uploadImage } from '../services/cloudinary.service.js';

/**
 * Create a new group
 * POST /api/group/create
 * Requires authentication
 */
export const createGroup = async (req, res, next) => {
    try {
        const { error, value } = createGroupSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        const adminId = req.user._id;

        // Handle profile picture upload if provided
        let profilePicUrl = null;
        if (value.profilePic) {
            try {
                const uploadResponse = await uploadImage(value.profilePic);
                profilePicUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                return sendError(res, 'Failed to upload profile picture', HTTP_STATUS.BAD_REQUEST);
            }
        }

        const groupData = {
            name: value.name,
            description: value.description || '',
            profilePic: profilePicUrl || null, // Use default from model if not provided
            adminId: adminId,
            members: value.members,
        };

        const newGroup = await groupService.createGroup(groupData);
        const populatedGroup = await groupService.getGroupById(newGroup._id);

        sendSuccess(res, populatedGroup, 'Group created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
        if (error.message.includes('more than 10 members')) {
            return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
        next(error);
    }
};

/**
 * Get all groups for the current user
 * GET /api/group
 * Requires authentication
 */
export const getUserGroups = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const groups = await groupService.getUserGroups(userId);
        sendSuccess(res, groups, 'Groups fetched successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get a specific group by ID
 * GET /api/group/:id
 * Requires authentication
 */
export const getGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Verify user is member of the group
        const isMember = await groupService.isGroupMember(id, userId);
        if (!isMember) {
            return sendError(res, 'You are not a member of this group', HTTP_STATUS.FORBIDDEN);
        }

        const group = await groupService.getGroupById(id);
        if (!group) {
            return sendError(res, 'Group not found', HTTP_STATUS.NOT_FOUND);
        }

        sendSuccess(res, group, 'Group fetched successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Update group details
 * PUT /api/group/:id
 * Requires authentication (must be admin)
 */
export const updateGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = updateGroupSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        const userId = req.user._id;
        const group = await groupService.getGroupById(id);

        if (!group) {
            return sendError(res, 'Group not found', HTTP_STATUS.NOT_FOUND);
        }

        // Verify admin - handle both populated and non-populated adminId
        const groupAdminIdStr = group.adminId?._id?.toString() || group.adminId?.toString();
        const userIdStr = userId.toString();
        
        if (groupAdminIdStr !== userIdStr) {
            return sendError(res, 'Only group admin can update group details', HTTP_STATUS.FORBIDDEN);
        }

        // Handle profile picture upload if provided
        if (value.profilePic) {
            try {
                const uploadResponse = await uploadImage(value.profilePic);
                value.profilePic = uploadResponse.secure_url;
            } catch (uploadError) {
                return sendError(res, 'Failed to upload profile picture', HTTP_STATUS.BAD_REQUEST);
            }
        }

        const updatedGroup = await groupService.updateGroup(id, value);
        sendSuccess(res, updatedGroup, 'Group updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Add members to group
 * POST /api/group/:id/members
 * Requires authentication (must be admin)
 */
export const addMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = updateMembersSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        const userId = req.user._id;
        const group = await groupService.getGroupById(id);

        if (!group) {
            return sendError(res, 'Group not found', HTTP_STATUS.NOT_FOUND);
        }

        // Verify admin - handle both populated and non-populated adminId
        const groupAdminIdStr = group.adminId?._id?.toString() || group.adminId?.toString();
        const userIdStr = userId.toString();
        
        if (groupAdminIdStr !== userIdStr) {
            return sendError(res, 'Only group admin can add members', HTTP_STATUS.FORBIDDEN);
        }

        const updatedGroup = await groupService.addMembersToGroup(id, value.memberIds);
        sendSuccess(res, updatedGroup, 'Members added successfully');
    } catch (error) {
        if (error.message.includes('more than 10 members')) {
            return sendError(res, error.message, HTTP_STATUS.BAD_REQUEST);
        }
        next(error);
    }
};

/**
 * Remove members from group
 * DELETE /api/group/:id/members
 * Requires authentication (must be admin)
 */
export const removeMembers = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = updateMembersSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        const userId = req.user._id;
        const updatedGroup = await groupService.removeMembersFromGroup(id, userId, value.memberIds);
        sendSuccess(res, updatedGroup, 'Members removed successfully');
    } catch (error) {
        if (error.message.includes('Only group admin') || error.message.includes('Cannot remove')) {
            return sendError(res, error.message, HTTP_STATUS.FORBIDDEN);
        }
        if (error.message.includes('not found')) {
            return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
        }
        next(error);
    }
};

/**
 * Delete group
 * DELETE /api/group/:id
 * Requires authentication (must be admin)
 */
export const deleteGroup = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        await groupService.deleteGroup(id, userId);
        sendSuccess(res, null, 'Group deleted successfully');
    } catch (error) {
        if (error.message.includes('Only group admin')) {
            return sendError(res, error.message, HTTP_STATUS.FORBIDDEN);
        }
        if (error.message.includes('not found')) {
            return sendError(res, error.message, HTTP_STATUS.NOT_FOUND);
        }
        next(error);
    }
};

