const catchAsync = require("../shared/catchAsync");
const ApiError = require("../error/handleApiError");
const ResponseHandler = require("../shared/response.handaler");

class GroupController {
  constructor(groupService) {
    this.groupService = groupService;
  }

  // Create Group
  createGroup = catchAsync(async (req, res) => {
    const { name, month } = req.body;
    const createdBy = req.user._id;

    const group = await this.groupService.createGroup({ name, month, createdBy });

    if (!group) throw new ApiError(400, "Failed to create group");

    ResponseHandler.success(res, "Group created successfully", group, 201);
  });

  // Join Group
  joinGroup = catchAsync(async (req, res) => {
    const { groupId } = req.body;
    const userId = req.user._id;

    const result = await this.groupService.joinGroup(groupId, userId);

    if (!result) throw new ApiError(400, "Unable to join group");

    ResponseHandler.success(res, "Joined group successfully", result);
  });

  // Get My Group
  getMyGroup = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const group = await this.groupService.getGroupByUser(userId);

    if (!group) throw new ApiError(404, "No group found");

    ResponseHandler.success(res, "Group info fetched", group);
  });

  // Get Members in Group
  getGroupMembers = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const members = await this.groupService.getGroupMembers(userId);

    if (!members) throw new ApiError(404, "No members found");

    ResponseHandler.success(res, "Group members fetched", members);
  });

  // Optional: Leave Group
  leaveGroup = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const success = await this.groupService.leaveGroup(userId);

    if (!success) throw new ApiError(400, "Failed to leave group");

    ResponseHandler.success(res, "Left group successfully");
  });
}

module.exports = GroupController;
