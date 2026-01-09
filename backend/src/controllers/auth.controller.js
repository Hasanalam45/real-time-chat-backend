/**
 * Authentication Controller
 * Handles authentication-related HTTP requests
 */

import { loginSchema, signupSchema } from '../validators/auth.validator.js';
import { sendSuccess, sendError } from '../utils/response.util.js';
import { generateToken } from '../utils/jwt.util.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';
import * as authService from '../services/auth.service.js';

/**
 * Sign up a new user
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
    try {
        // Validate request data
        const { error, value } = signupSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        // Check if user already exists
        const existingUser = await authService.findUserByEmail(value.email);
        if (existingUser) {
            return sendError(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.BAD_REQUEST);
        }

        // Create new user
        const newUser = await authService.createUser(value);

        // Generate token and set cookie
        generateToken(newUser._id.toString(), res);

        // Remove password from response
        const userData = newUser.toObject();
        delete userData.password;

        sendSuccess(res, userData, SUCCESS_MESSAGES.USER_CREATED, HTTP_STATUS.CREATED);
    } catch (error) {
        next(error);
    }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        // Validate request data
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return sendError(res, error.details[0].message, HTTP_STATUS.BAD_REQUEST);
        }

        // Find user by email (include password for verification)
        const user = await authService.findUserByEmail(value.email, true);
        if (!user) {
            return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
        }

        // Verify password
        const isPasswordCorrect = await authService.comparePassword(value.password, user.password);
        if (!isPasswordCorrect) {
            return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
        }

        // Generate token and set cookie
        generateToken(user._id.toString(), res);

        // Remove password from response
        const userData = user.toObject();
        delete userData.password;

        sendSuccess(res, userData, SUCCESS_MESSAGES.USER_LOGGED_IN);
    } catch (error) {
        next(error);
    }
};

/**
 * Log out current user
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 0 });
    sendSuccess(res, null, SUCCESS_MESSAGES.LOGGED_OUT);
};

/**
 * Update user profile picture
 * PUT /api/auth/update-profile
 * Requires authentication
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return sendError(res, ERROR_MESSAGES.PROFILE_PIC_REQUIRED, HTTP_STATUS.BAD_REQUEST);
        }

        // Upload to Cloudinary and update profile
        const { uploadImage } = await import('../services/cloudinary.service.js');
        const uploadResponse = await uploadImage(profilePic);

        const updatedUser = await authService.updateUserProfilePic(userId, uploadResponse.secure_url);

        if (!updatedUser) {
            return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        sendSuccess(res, updatedUser, SUCCESS_MESSAGES.PROFILE_UPDATED);
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user information
 * GET /api/auth/user-info
 * Requires authentication
 */
export const getUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const userInfo = await authService.findUserById(userId);

        if (!userInfo) {
            return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }

        sendSuccess(res, userInfo, SUCCESS_MESSAGES.USER_DATA_FETCHED);
    } catch (error) {
        next(error);
    }
};

/**
 * Check authentication status
 * GET /api/auth/check-auth
 * Requires authentication
 */
export const checkAuth = (req, res) => {
    sendSuccess(res, req.user, SUCCESS_MESSAGES.USER_DATA_FETCHED);
};

