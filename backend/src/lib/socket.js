/**
 * Socket.IO Configuration
 * Real-time communication setup using Socket.IO
 */

import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { config } from '../config/env.config.js';
import { SOCKET_EVENTS } from '../config/constants.js';

const app = express();
const server = http.createServer(app);

/**
 * CORS origin validation for Socket.IO
 * Handles origins with or without protocol
 */
const validateSocketOrigin = (origin, callback) => {
    // Allow requests with no origin
    if (!origin) {
        return callback(null, true);
    }

    // Get allowed origin from config
    const allowedOrigin = config.cors.origin;

    // Normalize: remove protocol from both for comparison
    const normalizeOrigin = (url) => url.replace(/^https?:\/\//, '').toLowerCase();

    const originNormalized = normalizeOrigin(origin);
    const allowedNormalized = normalizeOrigin(allowedOrigin);

    // Check if origins match (with or without protocol)
    const isAllowed = originNormalized === allowedNormalized ||
        origin === allowedOrigin ||
        origin === `https://${allowedNormalized}` ||
        origin === `http://${allowedNormalized}`;

    if (isAllowed) {
        callback(null, true);
    } else {
        console.log(`❌ Socket CORS blocked: ${origin}`);
        console.log(`   Allowed: ${allowedOrigin}`);
        callback(new Error('Not allowed by CORS'));
    }
};

/**
 * Initialize Socket.IO server with CORS configuration
 */
const io = new Server(server, {
    cors: {
        origin: validateSocketOrigin,
        credentials: config.cors.credentials,
        methods: ['GET', 'POST'],
    },
});



/**
 * Map to store online users
 * Format: { userId: socketId }
 */
const userSocketMap = {};

/**
 * Get socket ID for a user
 * @param {string} userId - User ID
 * @returns {string|undefined} Socket ID if user is online
 */
export function getRecieverSocketId(userId) {
    return userSocketMap[userId];
}

/**
 * Get all online user IDs
 * @returns {Array<string>} Array of online user IDs
 */
export function getOnlineUsers() {
    return Object.keys(userSocketMap);
}

// Socket connection handling
io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Extract userId from handshake query
    const userId = socket.handshake.query.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`📝 Online users:`, Object.keys(userSocketMap));

        // Broadcast updated online users list to all clients
        io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, Object.keys(userSocketMap));
    }

    // Handle joining a group room
    socket.on(SOCKET_EVENTS.JOIN_GROUP, (groupId) => {
        const roomName = `group_${groupId}`;
        socket.join(roomName);
        console.log(`👥 User ${userId} joined group room: ${roomName}`);

        // Notify other members in the group (optional)
        socket.to(roomName).emit('userJoinedGroup', { userId, groupId });
    });

    // Handle leaving a group room
    socket.on(SOCKET_EVENTS.LEAVE_GROUP, (groupId) => {
        const roomName = `group_${groupId}`;
        socket.leave(roomName);
        console.log(`👋 User ${userId} left group room: ${roomName}`);

        // Notify other members in the group (optional)
        socket.to(roomName).emit('userLeftGroup', { userId, groupId });
    });

    // Handle disconnection
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(`❌ User disconnected: ${socket.id}`);

        if (userId) {
            delete userSocketMap[userId];
            // Broadcast updated online users list
            io.emit(SOCKET_EVENTS.GET_ONLINE_USERS, Object.keys(userSocketMap));
        }
    });
});

export { io, server, app };

