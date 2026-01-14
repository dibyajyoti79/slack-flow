import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(50, { message: "Description must be at most 50 characters long" })
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" })
    .optional(),
  description: z
    .string({ required_error: "Description is required" })
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(50, { message: "Description must be at most 50 characters long" })
    .optional(),
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string(),
  role: z.enum(["admin", "member"]),
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string(),
});
