import { Router } from "express";
import { channelController } from "../../controllers/channel.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const channelRouter = Router();

channelRouter.get(
  "/:channelId",
  authenticate,
  channelController.getChannelById
);

export default channelRouter;
