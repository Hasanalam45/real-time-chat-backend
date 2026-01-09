/**
 * Group Service
 * Business logic for group operations
 */

import Group from '../models/group.model.js';
import Message from '../models/message.model.js';

/**
 * Create a new group
 * @param {Object} groupData - Group data (name, description, profilePic, adminId, members)
 * @returns {Promise<Object>} Created group object
 */
export const createGroup = async (groupData) => {
    // Import mongoose for ObjectId conversion
    const mongoose = (await import('mongoose')).default;

    // Ensure admin is included in members array
    // Convert all IDs to strings first for uniqueness check
    const adminIdStr = groupData.adminId.toString();
    const memberIdsStr = (groupData.members || []).map(id => id.toString());

    // Remove duplicates by converting to Set, then back to array
    const uniqueMemberIdsStr = Array.from(new Set([adminIdStr, ...memberIdsStr]));

    // Convert string IDs to ObjectIds for Mongoose
    const memberObjectIds = uniqueMemberIdsStr.slice(0, 10).map(idStr => {
        try {
            return new mongoose.Types.ObjectId(idStr);
        } catch (error) {
            throw new Error(`Invalid member ID: ${idStr}`);
        }
    });

    const newGroup = new Group({
        name: groupData.name,
        description: groupData.description || '',
        profilePic: groupData.profilePic || null,
        adminId: groupData.adminId, // This is already an ObjectId from req.user._id
        members: memberObjectIds, // Array of ObjectIds
    });

    // The pre-save hook will double-check admin is in members array
    const savedGroup = await newGroup.save();

    console.log('Group created:', {
        id: savedGroup._id,
        name: savedGroup.name,
        adminId: savedGroup.adminId,
        membersCount: savedGroup.members.length,
        members: savedGroup.members.map(m => m.toString()),
    });

    return savedGroup;
};

/**
 * Get all groups for a user (where user is admin or member)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of groups
 */
export const getUserGroups = async (userId) => {
    return Group.find({
        $or: [
            { adminId: userId },
            { members: userId },
        ],
    })
        .populate('adminId', 'fullname profilePic email')
        .populate('members', 'fullname profilePic email')
        .sort({ updatedAt: -1 });
};

/**
 * Get group by ID (with populated members)
 * @param {string} groupId - Group ID
 * @returns {Promise<Object|null>} Group object if found, null otherwise
 */
export const getGroupById = async (groupId) => {
    return Group.findById(groupId)
        .populate('adminId', 'fullname profilePic email')
        .populate('members', 'fullname profilePic email');
};

/**
 * Update group details
 * @param {string} groupId - Group ID
 * @param {Object} updateData - Fields to update (name, description, profilePic)
 * @returns {Promise<Object|null>} Updated group object
 */
export const updateGroup = async (groupId, updateData) => {
    return Group.findByIdAndUpdate(
        groupId,
        { $set: updateData },
        { new: true, runValidators: true }
    )
        .populate('adminId', 'fullname profilePic email')
        .populate('members', 'fullname profilePic email');
};

/**
 * Add members to group
 * @param {string} groupId - Group ID
 * @param {Array<string>} memberIds - Array of user IDs to add
 * @returns {Promise<Object|null>} Updated group object
 */
export const addMembersToGroup = async (groupId, memberIds) => {
    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }

    // Combine existing members with new members, remove duplicates, limit to 10
    const allMembers = Array.from(new Set([...group.members.map(m => m.toString()), ...memberIds]));

    if (allMembers.length > 10) {
        throw new Error('Group cannot have more than 10 members');
    }

    group.members = allMembers;
    return group.save().then(() => getGroupById(groupId));
};

/**
 * Remove members from group
 * @param {string} groupId - Group ID
 * @param {string} adminId - Admin ID (to verify permissions)
 * @param {Array<string>} memberIds - Array of user IDs to remove
 * @returns {Promise<Object|null>} Updated group object
 */
export const removeMembersFromGroup = async (groupId, adminId, memberIds) => {
    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }

    // Verify user is admin
    // Use Mongoose's equals() method for reliable ObjectId comparison
    // Also handle string comparison as fallback
    const isAdmin = group.adminId.equals(adminId) ||
        group.adminId.toString() === adminId.toString() ||
        String(group.adminId) === String(adminId);

    if (!isAdmin) {
        console.error('Admin verification failed:', {
            groupAdminId: group.adminId,
            groupAdminIdType: typeof group.adminId,
            requestAdminId: adminId,
            requestAdminIdType: typeof adminId,
            equalsCheck: group.adminId.equals(adminId),
            stringCheck: group.adminId.toString() === adminId.toString()
        });
        throw new Error('Only group admin can remove members');
    }

    // Convert memberIds to strings for comparison
    const memberIdsStr = memberIds.map(id => id.toString());
    const groupAdminIdStr = group.adminId.toString();

    // Cannot remove admin
    if (memberIdsStr.includes(groupAdminIdStr)) {
        throw new Error('Cannot remove group admin');
    }

    // Filter out members to remove
    group.members = group.members.filter(
        memberId => !memberIdsStr.includes(memberId.toString())
    );

    return group.save().then(() => getGroupById(groupId));
};

/**
 * Delete group
 * @param {string} groupId - Group ID
 * @param {string} adminId - Admin ID (to verify permissions)
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteGroup = async (groupId, adminId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        throw new Error('Group not found');
    }

    // Verify user is admin using reliable ObjectId comparison
    const isAdmin = group.adminId.equals(adminId) ||
        group.adminId.toString() === adminId.toString() ||
        String(group.adminId) === String(adminId);

    if (!isAdmin) {
        throw new Error('Only group admin can delete the group');
    }

    // Delete all messages in the group
    await Message.deleteMany({ groupId });

    // Delete the group
    await Group.findByIdAndDelete(groupId);
    return true;
};

/**
 * Check if user is member of group
 * @param {string} groupId - Group ID
 * @param {string|ObjectId} userId - User ID (string or ObjectId)
 * @returns {Promise<boolean>} True if user is member
 */
export const isGroupMember = async (groupId, userId) => {
    const group = await Group.findById(groupId);
    if (!group) {
        return false;
    }

    // Convert both sides to strings for comparison
    const userIdStr = userId.toString();
    const adminIdStr = group.adminId.toString();

    return (
        adminIdStr === userIdStr ||
        group.members.some(memberId => memberId.toString() === userIdStr)
    );
};

