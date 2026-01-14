import { z } from "zod";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../validators/workspace.validator";

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
