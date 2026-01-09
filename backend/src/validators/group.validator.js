/**
 * Group Validators
 * Joi validation schemas for group routes
 */

import Joi from 'joi';

/**
 * Create group validation schema
 */
export const createGroupSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Group name must be at least 2 characters long',
            'string.max': 'Group name cannot exceed 50 characters',
            'any.required': 'Group name is required',
        }),
    description: Joi.string()
        .max(200)
        .allow('', null)
        .optional()
        .messages({
            'string.max': 'Description cannot exceed 200 characters',
        }),
    profilePic: Joi.string()
        .uri()
        .allow('', null)
        .optional(),
    members: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .max(9)
        .required()
        .messages({
            'array.min': 'Group must have at least 1 member',
            'array.max': 'Group cannot have more than 9 members (10 total including you)',
            'any.required': 'At least one member is required',
        }),
});

/**
 * Update group validation schema
 */
export const updateGroupSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Group name must be at least 2 characters long',
            'string.max': 'Group name cannot exceed 50 characters',
        }),
    description: Joi.string()
        .max(200)
        .allow('', null)
        .optional()
        .messages({
            'string.max': 'Description cannot exceed 200 characters',
        }),
    profilePic: Joi.string()
        .uri()
        .allow('', null)
        .optional(),
});

/**
 * Add/Remove members validation schema
 */
export const updateMembersSchema = Joi.object({
    memberIds: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .max(9)
        .required()
        .messages({
            'array.min': 'At least one member ID is required',
            'array.max': 'Group cannot have more than 9 members (10 total including admin)',
            'any.required': 'Member IDs are required',
        }),
});

