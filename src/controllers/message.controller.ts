import { Request, Response } from "express";
import messageService from "../services/message.service";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";

const messageController = {
  async getMessages(req: Request, res: Response) {
    const { page, limit } = req.query;
    const { channelId } = req.params;

    const pageNumber = Math.max(parseInt(page as string) || 1, 1);
    const limitNumber = Math.min(parseInt(limit as string) || 10, 50);

    const messages = await messageService.getMessages(
      channelId,
      pageNumber,
      limitNumber,
      req.user!.id
    );

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse("Messages fetched", messages));
  },
};

export default messageController;
