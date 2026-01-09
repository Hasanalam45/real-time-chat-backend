/**
 * Authentication Service
 * Business logic for authentication operations
 */

import bcrypt from 'bcryptjs';
import userModel from '../models/user.model.js';
import { config } from '../config/env.config.js';

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} True if passwords match
 */
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * Check if user exists by email
 * @param {string} email - User email
 * @param {boolean} includePassword - Whether to include password field (default: false)
 * @returns {Promise<Object|null>} User object if exists, null otherwise
 */
export const findUserByEmail = async (email, includePassword = false) => {
    const query = userModel.findOne({ email });
    if (includePassword) {
        return query.select('+password');
    }
    return query;
};

/**
 * Create new user
 * @param {Object} userData - User data (email, password, fullname)
 * @returns {Promise<Object>} Created user object
 */
export const createUser = async (userData) => {
    const hashedPassword = await hashPassword(userData.password);

    const newUser = new userModel({
        ...userData,
        password: hashedPassword,
        profilePic: userData.profilePic || config.app.defaultProfilePic,
    });

    return newUser.save();
};

/**
 * Find user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object if found, null otherwise
 */
export const findUserById = async (userId) => {
    return userModel.findById(userId).select('-password');
};

/**
 * Update user profile picture
 * @param {string} userId - User ID
 * @param {string} profilePicUrl - Profile picture URL
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserProfilePic = async (userId, profilePicUrl) => {
    return userModel.findByIdAndUpdate(
        userId,
        { profilePic: profilePicUrl },
        { new: true, select: '-password' }
    );
};

/**
 * Get all users except the specified user
 * @param {string} excludeUserId - User ID to exclude
 * @returns {Promise<Array>} Array of users
 */
export const getAllUsersExcept = async (excludeUserId) => {
    return userModel.find({ _id: { $ne: excludeUserId } }).select('-password');
};

