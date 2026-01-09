/**
 * Application Constants
 * Centralized constants used throughout the application
 */

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
    // Auth Errors
    UNAUTHORIZED: 'Unauthorized - No token provided',
    INVALID_TOKEN: 'Unauthorized - Invalid token',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid Credentials',
    EMAIL_ALREADY_EXISTS: 'Email Already Registered',
    TOKEN_REQUIRED: 'Token required',

    // Validation Errors
    PROFILE_PIC_REQUIRED: 'Profile picture is required',
    INVALID_USER_DATA: 'Invalid user data',
    VALIDATION_ERROR: 'Validation error',

    // General Errors
    INTERNAL_ERROR: 'Internal server error',
    DATABASE_ERROR: 'Database connection error',
};

export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User Created Successfully',
    USER_LOGGED_IN: 'User logged in successfully',
    LOGGED_OUT: 'Logged out successfully',
    PROFILE_UPDATED: 'Profile Picture Updated Successfully',
    USER_DATA_FETCHED: 'User Data Fetched Successfully',
    USERS_FETCHED: 'Users fetched successfully',
    MESSAGES_FETCHED: 'Messages fetched successfully',
    MESSAGE_SENT: 'Message sent successfully',
};

export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    GET_ONLINE_USERS: 'getOnlineUsers',
    NEW_MESSAGE: 'newMessage',
    JOIN_GROUP: 'joinGroup',
    LEAVE_GROUP: 'leaveGroup',
    GROUP_MESSAGE: 'groupMessage',
};
