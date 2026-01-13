import { Router } from "express";
import { validateRequestBody } from "../../validators";
import { signupSchema } from "../../validators/user.validator";
import userController from "../../controllers/user.controller";

const userRouter = Router();

userRouter.post(
  "/signup",
  validateRequestBody(signupSchema),
  userController.signup
);
export default userRouter;
