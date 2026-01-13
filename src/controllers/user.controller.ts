import { Request, Response } from "express";
import userService from "../services/user.service";
import logger from "../config/logger.config";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/api-response";

const userController = {
  signup: async (req: Request, res: Response) => {
    logger.info("Signup request received", req.body);
    const user = await userService.signup(req.body);
    logger.info("Signup successful", user);
    res
      .status(StatusCodes.CREATED)
      .json(new ApiResponse("Signup successful", user));
  },
};

export default userController;
