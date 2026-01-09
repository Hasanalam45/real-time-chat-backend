/**
 * Message Service
 * Business logic for message operations
 */

import Message from '../models/message.model.js';

/**
 * Get all messages between two users (direct messages)
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {Promise<Array>} Array of messages
 */
export const getMessagesBetweenUsers = async (userId1, userId2) => {
  return Message.find({
    messageType: 'direct',
    $or: [
      { senderId: userId1, recieverId: userId2 },
      { senderId: userId2, recieverId: userId1 },
    ],
  })
    .populate('senderId', 'fullname profilePic')
    .sort({ createdAt: 1 });
};

/**
 * Get all messages in a group
 * @param {string} groupId - Group ID
 * @returns {Promise<Array>} Array of messages
 */
export const getGroupMessages = async (groupId) => {
  return Message.find({
    messageType: 'group',
    groupId: groupId,
  })
    .populate('senderId', 'fullname profilePic')
    .sort({ createdAt: 1 });
};

/**
 * Create a new message (direct or group)
 * @param {Object} messageData - Message data (senderId, recieverId/groupId, text, image, messageType)
 * @returns {Promise<Object>} Created message object
 */
export const createMessage = async (messageData) => {
  const newMessage = new Message({
    senderId: messageData.senderId,
    messageType: messageData.messageType || 'direct',
    text: messageData.text || null,
    image: messageData.image || null,
  });

  if (messageData.messageType === 'group') {
    newMessage.groupId = messageData.groupId;
  } else {
    newMessage.recieverId = messageData.recieverId;
  }

  const savedMessage = await newMessage.save();
  return Message.findById(savedMessage._id)
    .populate('senderId', 'fullname profilePic');
};
