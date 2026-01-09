/**
 * Group Model
 * Mongoose schema and model for Group Chat
 */

import mongoose from 'mongoose';
import { config } from '../config/env.config.js';

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Group name is required'],
            trim: true,
            maxlength: [50, 'Group name cannot exceed 50 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Description cannot exceed 200 characters'],
        },
        profilePic: {
            type: String,
            default: 'https://ui-avatars.com/api/?name=Group&background=6366f1&color=fff&size=200&bold=true',
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Group admin is required'],
            index: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        isGroup: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Validate maximum members (admin + 9 more = 10 total)
groupSchema.pre('save', function (next) {
    // Ensure admin is in members array (check by string comparison)
    const adminIdStr = this.adminId.toString();
    const adminInMembers = this.members.some(memberId => memberId.toString() === adminIdStr);

    if (!adminInMembers) {
        // Add admin at the beginning if not already present
        this.members.unshift(this.adminId);
    }

    // Check max length (10 total including admin)
    if (this.members.length > 10) {
        return next(new Error('Group cannot have more than 10 members (including admin)'));
    }

    next();
});

// Index for faster queries
groupSchema.index({ adminId: 1 });
groupSchema.index({ members: 1 });
groupSchema.index({ createdAt: -1 });

const Group = mongoose.model('Group', groupSchema);

export default Group;

