/**
 * Authentication Validators
 * Joi validation schemas for authentication routes
 */

import Joi from 'joi';

/**
 * Signup validation schema
 */
export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  fullname: Joi.string().min(2).required().messages({
    'string.min': 'Full name must be at least 2 characters long',
    'any.required': 'Full name is required',
  }),
  picture: Joi.string().uri().optional(),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
});

