// const groupModel = require('../Models/groupModel');
const groupModel = require('../Models/groupModel');
const userModel = require('../Models/userModel');

class GroupService {
  constructor() {
    this.groupModel = groupModel;
    this.userModel = userModel;
  }

  // 1. Create Group
  async createGroup({ name, month, createdBy }) {
    const group = await this.groupModel.create({
      name,
      month,
      createdBy,
      totalMember: 1
    });

    // Update user to assign group
    await this.userModel.findByIdAndUpdate(createdBy, { groupId: group._id });

    return group;
  }

  // 2. Join Existing Group
  async joinGroup(groupId, userId) {
    const group = await this.groupModel.findById(groupId);
    if (!group) return null;

    // Update group member count
    group.totalMember += 1;
    await group.save();

    // Update user to add groupId
    await this.userModel.findByIdAndUpdate(userId, { groupId: group._id });

    return group;
  }

  // 3. Get Group by User
  async getGroupByUser(userId) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.groupId) return null;

    const group = await this.groupModel.findById(user.groupId);
    return group;
  }

  // 4. Get All Members in the Group
  async getGroupMembers(userId) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.groupId) return null;

    const members = await this.userModel.find({ groupId: user.groupId }).select('-password');
    return members;
  }

  // 5. Optional: Leave Group
  async leaveGroup(userId) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.groupId) return false;

    const groupId = user.groupId;

    // Decrement total members
    await this.groupModel.findByIdAndUpdate(groupId, {
      $inc: { totalMember: -1 }
    });

    // Remove groupId from user
    await this.userModel.findByIdAndUpdate(userId, { groupId: null });

    return true;
  }
}

module.exports = GroupService;
