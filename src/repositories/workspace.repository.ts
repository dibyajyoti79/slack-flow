import { Types } from "mongoose";
import Workspace, {
  MemberRole,
  WorkspaceAttrs,
} from "../models/workspace.model";
import { BadRequestError, ForbiddenError } from "../utils/api-error";
import crudRepository from "./crud.repository";
import User from "../models/user.model";
import Channel from "../models/channel.model";
import channelRepository from "./channel.repository";

const workspaceRepository = {
  ...crudRepository<WorkspaceAttrs>(Workspace),
  async getWorkspaceByJoinCode(joinCode: string) {
    const workspace = await Workspace.findOne({ joinCode });
    return workspace;
  },
  async getWorkspaceByName(name: string) {
    const workspace = await Workspace.findOne({ name });
    return workspace;
  },
  async addMemberToWorkspace(
    workspaceId: string,
    memberId: string,
    role: MemberRole
  ) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }

    const memberObjectId = new Types.ObjectId(memberId);

    const isValidUser = await User.findById(memberObjectId);
    if (!isValidUser) {
      throw new BadRequestError("User not found");
    }

    if (
      workspace.members.some((member) => member.memberId.equals(memberObjectId))
    ) {
      throw new ForbiddenError("Member already exists in workspace");
    }

    workspace.members.push({
      memberId: memberObjectId,
      role,
    });

    await workspace.save();
    return workspace;
  },

  async addChannelToWorkspace(workspaceId: string, channelName: string) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }

    const existingChannel = await Channel.findOne({
      _id: { $in: workspace.channels },
      name: channelName,
    });

    if (existingChannel) {
      throw new ForbiddenError("Channel already exists in workspace");
    }
    const channel = await channelRepository.create({ name: channelName });
    workspace.channels.push(channel._id);
    await workspace.save();
    return workspace;
  },
  async getAllWorkspacesByMemberId(memberId: string) {
    const workspaces = await Workspace.find({
      members: { $elemMatch: { memberId: new Types.ObjectId(memberId) } },
    });
    return workspaces;
  },
};

export default workspaceRepository;
