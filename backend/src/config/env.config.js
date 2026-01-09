/**
 * Environment Configuration
 * Centralized configuration for all environment variables
 * Access environment variables through this file instead of directly using process.env
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that required environment variables are present
 * @throws {Error} If required environment variable is missing
 */
const requireEnv = (key, description) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key} - ${description}`);
    }
    return value;
};

export const config = {
    // Server Configuration
    server: {
        port: process.env.PORT || 5001,
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    // Database Configuration
    database: {
        uri: requireEnv('MONGODB_URI', 'MongoDB connection string'),
    },

    // JWT Configuration
    jwt: {
        secret: requireEnv('JWT_SECRET', 'JWT secret key for token signing'),
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        cookieMaxAge: parseInt(process.env.JWT_COOKIE_MAX_AGE || '604800000', 10), // 7 days in milliseconds
        httpOnly: true,
        sameSite: process.env.JWT_COOKIE_SAME_SITE || 'None',
        secure: process.env.JWT_COOKIE_SECURE !== 'false', // Default true for production
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    },

    // Cloudinary Configuration
    cloudinary: {
        cloudName: requireEnv('CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name'),
        apiKey: requireEnv('CLOUDINARY_API_KEY', 'Cloudinary API key'),
        apiSecret: requireEnv('CLOUDINARY_API_SECRET', 'Cloudinary API secret'),
    },

    // Application Settings
    app: {
        name: process.env.APP_NAME || 'Real-time Chat App',
        defaultProfilePic: process.env.DEFAULT_PROFILE_PIC_URL || 'https://t4.ftcdn.net/jpg/00/87/28/19/360_F_87281963_29bnkFXa6RQnJYWeRfrSpieagNxw1Rru.jpg',
        jsonLimit: process.env.JSON_LIMIT || '10mb',
    },
};

// Validate all required environment variables on startup
const validateConfig = () => {
    try {
        // This will throw if any required env var is missing
        requireEnv('MONGODB_URI', 'Database connection');
        requireEnv('JWT_SECRET', 'JWT secret');
        requireEnv('CLOUDINARY_CLOUD_NAME', 'Cloudinary cloud name');
        requireEnv('CLOUDINARY_API_KEY', 'Cloudinary API key');
        requireEnv('CLOUDINARY_API_SECRET', 'Cloudinary API secret');
    } catch (error) {
        console.error('❌ Configuration Error:', error.message);
        if (config.server.nodeEnv === 'production') {
            process.exit(1);
        } else {
            console.warn('⚠️  Continuing in development mode with missing variables...');
        }
    }
};

validateConfig();

export default config;



