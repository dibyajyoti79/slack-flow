import { Router } from "express";
import { validateRequestBody } from "../../validators";
import { signinSchema, signupSchema } from "../../validators/user.validator";
import userController from "../../controllers/user.controller";

const userRouter = Router();

userRouter.post(
  "/signup",
  validateRequestBody(signupSchema),
  userController.signup
);

userRouter.post(
  "/signin",
  validateRequestBody(signinSchema),
  userController.signin
);

export default userRouter;
