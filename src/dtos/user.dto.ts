import { z } from "zod";
import { signupSchema } from "../validators/user.validator";

export type SignupDto = z.infer<typeof signupSchema>;
