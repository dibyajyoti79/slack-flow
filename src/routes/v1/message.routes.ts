import { Router } from "express";
import messageController from "../../controllers/message.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const messageRouter = Router();

messageRouter.get("/:channelId", authenticate, messageController.getMessages);

export default messageRouter;
