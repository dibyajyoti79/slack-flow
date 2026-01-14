import { Router } from "express";
import { workspaceController } from "../../controllers/workspace.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequestBody } from "../../validators";
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../../validators/workspace.validator";

const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  authenticate,
  validateRequestBody(createWorkspaceSchema),
  workspaceController.createWorkspace
);

workspaceRouter.get("/", authenticate, workspaceController.getWorkspacesByUser);

workspaceRouter.delete(
  "/:workspaceId",
  authenticate,
  workspaceController.deleteWorkspace
);

workspaceRouter.get(
  "/:workspaceId",
  authenticate,
  workspaceController.getWorkspaceDetails
);
workspaceRouter.get(
  "/join/:joinCode",
  authenticate,
  workspaceController.getWorkspaceByJoinCode
);
workspaceRouter.put(
  "/:workspaceId",
  authenticate,
  validateRequestBody(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);

workspaceRouter.post(
  "/:workspaceId/members",
  authenticate,
  validateRequestBody(addMemberToWorkspaceSchema),
  workspaceController.addMemberToWorkspace
);

workspaceRouter.post(
  "/:workspaceId/channels",
  authenticate,
  validateRequestBody(addChannelToWorkspaceSchema),
  workspaceController.addChannelToWorkspace
);

export default workspaceRouter;
