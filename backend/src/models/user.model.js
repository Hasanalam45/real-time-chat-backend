/**
 * User Model
 * Mongoose schema and model for User
 */

import mongoose from 'mongoose';
import { config } from '../config/env.config.js';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't include password in queries by default
        },
        fullname: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
            minlength: [2, 'Full name must be at least 2 characters long'],
        },
        profilePic: {
            type: String,
            default: config.app.defaultProfilePic,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;

