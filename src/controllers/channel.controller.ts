import { Request, Response } from "express";
import { channelService } from "../services/channel.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";

export const channelController = {
  async getChannelById(req: Request, res: Response) {
    const channel = await channelService.getChannelById(
      req.params.channelId,
      req.user!.id
    );
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Channel fetched", channel));
  },
};
