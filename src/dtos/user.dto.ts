import { z } from "zod";
import { signinSchema, signupSchema } from "../validators/user.validator";

export type SignupDto = z.infer<typeof signupSchema>;
export type SigninDto = z.infer<typeof signinSchema>;
