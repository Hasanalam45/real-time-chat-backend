/**
 * JWT Utility
 * Token generation and management utilities
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';

/**
 * Generate JWT token and set it in HTTP-only cookie
 * @param {string} userId - User ID to encode in token
 * @param {Object} res - Express response object
 * @returns {string} Generated JWT token
 */
export const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );

  res.cookie('jwt', token, {
    maxAge: config.jwt.cookieMaxAge,
    httpOnly: config.jwt.httpOnly,
    sameSite: config.jwt.sameSite,
    secure: config.jwt.secure,
    path: '/',
  });

  return token;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

