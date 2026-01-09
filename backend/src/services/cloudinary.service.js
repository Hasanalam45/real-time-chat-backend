/**
 * Cloudinary Service
 * Service for handling Cloudinary image uploads
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Upload image to Cloudinary
 * @param {string} imageData - Base64 encoded image data
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with secure_url
 */
export const uploadImage = async (imageData, options = {}) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageData, {
      resource_type: 'image',
      ...options,
    });
    return uploadResponse;
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary;

