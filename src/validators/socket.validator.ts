import { z } from "zod";

export const createMessageSchema = z.object({
  body: z
    .string({ required_error: "Message body is required" })
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long"),
  image: z.string().url("Invalid image URL").optional(),
  channelId: z.string({ required_error: "Channel ID is required" }),
  workspaceId: z.string({ required_error: "Workspace ID is required" }),
});

export const directMessageSchema = z.object({
  body: z
    .string({ required_error: "Message body is required" })
    .min(1, "Message cannot be empty")
    .max(5000, "Message too long"),
  image: z.string().url("Invalid image URL").optional(),
  receiverId: z.string({ required_error: "Receiver ID is required" }),
  workspaceId: z.string({ required_error: "Workspace ID is required" }),
});

export const typingSchema = z.object({
  channelId: z.string().optional(),
  recipientId: z.string().optional(),
  isTyping: z.boolean({ required_error: "isTyping is required" }),
});

// Helper to validate socket data
export const validateSocketData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors.map((e) => e.message).join(", ");
    return { success: false, error: errorMessage };
  }
  return { success: true, data: result.data };
};
