import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(50, { message: "Username must be at most 50 characters long" }),
});
