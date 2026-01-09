/**
 * Message Model
 * Mongoose schema and model for Message
 */

import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender ID is required'],
            index: true,
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            sparse: true, // Allow null for group messages
            index: true,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            sparse: true, // Allow null for direct messages
            index: true,
        },
        text: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        // Ensure either recieverId or groupId is present
        messageType: {
            type: String,
            enum: ['direct', 'group'],
            required: true,
            default: 'direct',
        },
    },
    {
        timestamps: true,
    }
);

// Validation: Either recieverId (direct) or groupId (group) must be present
messageSchema.pre('save', function (next) {
    if (this.messageType === 'direct' && !this.recieverId) {
        return next(new Error('Receiver ID is required for direct messages'));
    }
    if (this.messageType === 'group' && !this.groupId) {
        return next(new Error('Group ID is required for group messages'));
    }
    if (this.messageType === 'direct') {
        this.groupId = undefined;
    }
    if (this.messageType === 'group') {
        this.recieverId = undefined;
    }
    next();
});

// Compound indexes for efficient querying
// Direct messages between two users
messageSchema.index({ senderId: 1, recieverId: 1, createdAt: 1 });
messageSchema.index({ recieverId: 1, senderId: 1, createdAt: 1 });
// Group messages
messageSchema.index({ groupId: 1, createdAt: 1 });
messageSchema.index({ messageType: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;

