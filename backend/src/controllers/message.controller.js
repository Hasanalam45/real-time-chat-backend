/**
 * Message Controller
 * Handles message-related HTTP requests
 */

import { sendSuccess, sendError } from '../utils/response.util.js';
import { HTTP_STATUS } from '../config/constants.js';
import { SUCCESS_MESSAGES } from '../config/constants.js';
import * as messageService from '../services/message.service.js';
import * as authService from '../services/auth.service.js';
import * as groupService from '../services/group.service.js';
import { getRecieverSocketId, io } from '../lib/socket.js';

/**
 * Get all users for sidebar (excluding current user)
 * GET /api/message/users
 * Requires authentication
 */
export const getUsersforSidebar = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await authService.getAllUsersExcept(loggedInUserId);
        sendSuccess(res, users, SUCCESS_MESSAGES.USERS_FETCHED);
    } catch (error) {
        next(error);
    }
};

/**
 * Get messages between current user and another user, or group messages
 * GET /api/message/:id?type=direct|group
 * Requires authentication
 */
export const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type = 'direct' } = req.query; // Default to direct for backward compatibility
    const currentUserId = req.user._id;

    let messages;

    if (type === 'group') {
      // Verify user is member of the group
      const isMember = await groupService.isGroupMember(id, currentUserId);
      if (!isMember) {
        return sendError(res, 'You are not a member of this group', HTTP_STATUS.FORBIDDEN);
      }
      messages = await messageService.getGroupMessages(id);
    } else {
      // Direct messages
      messages = await messageService.getMessagesBetweenUsers(currentUserId, id);
    }

    sendSuccess(res, messages, SUCCESS_MESSAGES.MESSAGES_FETCHED);
  } catch (error) {
    next(error);
  }
};

/**
 * Send a message to another user or to a group
 * POST /api/message/send/:id?type=direct|group
 * Requires authentication
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type = 'direct' } = req.query; // Default to direct for backward compatibility
    const senderId = req.user._id;
    const { text, image } = req.body;

    let imageUrl = null;

    // Upload image if provided
    if (image) {
      const { uploadImage } = await import('../services/cloudinary.service.js');
      const uploadResponse = await uploadImage(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage;

    if (type === 'group') {
      // Verify user is member of the group
      const isMember = await groupService.isGroupMember(id, senderId);
      if (!isMember) {
        return sendError(res, 'You are not a member of this group', HTTP_STATUS.FORBIDDEN);
      }

      // Create group message
      newMessage = await messageService.createMessage({
        groupId: id,
        senderId,
        text: text || null,
        image: imageUrl,
        messageType: 'group',
      });

      // Emit to all group members via socket room
      io.to(`group_${id}`).emit('newMessage', newMessage);
    } else {
      // Create direct message
      newMessage = await messageService.createMessage({
        recieverId: id,
        senderId,
        text: text || null,
        image: imageUrl,
        messageType: 'direct',
      });

      // Emit real-time message to receiver if online
      const receiverSocketId = getRecieverSocketId(id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', newMessage);
      }
      
      // Also emit to sender if they have the chat open
      const senderSocketId = getRecieverSocketId(senderId.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit('newMessage', newMessage);
      }
    }

    sendSuccess(res, newMessage, SUCCESS_MESSAGES.MESSAGE_SENT);
  } catch (error) {
    next(error);
  }
};

