import { CreateWorkspaceDto, UpdateWorkspaceDto } from "../dtos/workspace.dto";
import workspaceRepository from "../repositories/workspace.repository";
import { v4 as uuidv4 } from "uuid";
import { BadRequestError, UnauthorizedError } from "../utils/api-error";
import channelRepository from "../repositories/channel.repository";
import { MemberRole, WorkspaceAttrs } from "../models/workspace.model";
import userRepository from "../repositories/user.repository";
import { Types } from "mongoose";

export const workspaceService = {
  async createWorkspace(data: CreateWorkspaceDto, ownerId: string) {
    // check if workspace already exists with the same name
    const existingWorkspace = await workspaceRepository.getWorkspaceByName(
      data.name
    );
    if (existingWorkspace) {
      throw new BadRequestError("Workspace already exists");
    }
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRepository.create({
      name: data.name,
      description: data.description,
      joinCode,
      members: [],
      channels: [],
    });
    await workspaceRepository.addMemberToWorkspace(
      response._id,
      ownerId,
      "admin"
    );
    await workspaceRepository.addChannelToWorkspace(response._id, "general");

    return {
      name: response.name,
      description: response.description,
      joinCode: response.joinCode,
    };
  },

  async getWorkspacesByUser(userId: string) {
    const workspaces = await workspaceRepository.getAllWorkspacesByMemberId(
      userId
    );
    return workspaces;
  },

  async deleteWorkspace(workspaceId: string, userId: string) {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (!isAllowed) {
      throw new UnauthorizedError(
        "You are not allowed to delete this workspace"
      );
    }
    // delete all channels associated with the workspace
    await channelRepository.deleteMany(workspace.channels);
    const response = await workspaceRepository.delete(workspaceId);
    return response;
  },

  async getWorkspaceDetails(workspaceId: string, userId: string) {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new UnauthorizedError(
        "You are not allowed to access this workspace"
      );
    }
    return workspace;
  },

  async getWorkspaceByJoinCode(joinCode: string, userId: string) {
    const workspace = await workspaceRepository.getWorkspaceByJoinCode(
      joinCode
    );
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if (!isMember) {
      throw new UnauthorizedError(
        "You are not allowed to access this workspace"
      );
    }
    return workspace;
  },

  async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceDto,
    userId: string
  ) {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (!isAllowed) {
      throw new UnauthorizedError(
        "You are not allowed to update this workspace"
      );
    }
    const updatedWorkspace = await workspaceRepository.update(workspaceId, {
      name: data.name,
      description: data.description,
    });
    return updatedWorkspace;
  },

  async addMemberToWorkspace(
    workspaceId: string,
    memberId: string,
    role: MemberRole,
    userId: string
  ) {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (!isAllowed) {
      throw new UnauthorizedError(
        "You are not allowed to add members to this workspace"
      );
    }
    if (workspace.members.some((member) => member.memberId.equals(memberId))) {
      throw new BadRequestError("Member already member in workspace");
    }
    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new BadRequestError("User not found");
    }
    const response = await workspaceRepository.addMemberToWorkspace(
      workspace._id,
      memberId,
      role
    );
    return response;
  },

  async addChannelToWorkspace(
    workspaceId: string,
    channelName: string,
    userId: string
  ) {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new BadRequestError("Workspace not found");
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (!isAllowed) {
      throw new UnauthorizedError(
        "You are not allowed to add channels to this workspace"
      );
    }

    const isChannelIsPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );
    if (isChannelIsPartOfWorkspace) {
      throw new BadRequestError("Channel already exists in workspace");
    }

    const response = workspaceRepository.addChannelToWorkspace(
      workspace._id,
      channelName
    );
    return response;
  },
};
type WorkspaceMemberRuntime = {
  memberId: Types.ObjectId | { _id: Types.ObjectId };
  role: MemberRole;
};

type WorkspaceRuntime = {
  members: WorkspaceMemberRuntime[];
};
const isUserAdminOfWorkspace = (
  workspace: WorkspaceRuntime,
  userId: string
): boolean => {
  return workspace.members.some((member) => {
    const memberId =
      typeof member.memberId === "object"
        ? member.memberId._id
        : member.memberId;

    return member.role === "admin" && memberId.toString() === userId;
  });
};

const isUserMemberOfWorkspace = (
  workspace: WorkspaceAttrs,
  userId: string
): boolean => {
  const isAllowed = workspace.members.find(
    (member) => member.memberId.toString() === userId
  );
  return isAllowed ? true : false;
};
