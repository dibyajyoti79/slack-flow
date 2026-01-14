import { Request, Response } from "express";
import { workspaceService } from "../services/workspace.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";

export const workspaceController = {
  async createWorkspace(req: Request, res: Response) {
    const response = await workspaceService.createWorkspace(
      req.body,
      req.user!.id
    );
    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse("Workspace created", response));
  },

  async getWorkspacesByUser(req: Request, res: Response) {
    const workspaces = await workspaceService.getWorkspacesByUser(req.user!.id);
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Workspaces fetched", workspaces));
  },

  async deleteWorkspace(req: Request, res: Response) {
    const response = await workspaceService.deleteWorkspace(
      req.params.workspaceId,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Workspace deleted", response));
  },

  async getWorkspaceDetails(req: Request, res: Response) {
    const workspace = await workspaceService.getWorkspaceDetails(
      req.params.workspaceId,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Workspace details fetched", workspace));
  },

  async getWorkspaceByJoinCode(req: Request, res: Response) {
    const workspace = await workspaceService.getWorkspaceByJoinCode(
      req.params.joinCode,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Workspace details fetched", workspace));
  },

  async updateWorkspace(req: Request, res: Response) {
    const response = await workspaceService.updateWorkspace(
      req.params.workspaceId,
      req.body,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Workspace updated", response));
  },

  async addMemberToWorkspace(req: Request, res: Response) {
    const response = await workspaceService.addMemberToWorkspace(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Member added to workspace", response));
  },

  async addChannelToWorkspace(req: Request, res: Response) {
    const response = await workspaceService.addChannelToWorkspace(
      req.params.workspaceId,
      req.body.channelName,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Channel added to workspace", response));
  },
};
