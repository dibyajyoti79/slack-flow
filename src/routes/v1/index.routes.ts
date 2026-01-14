import express from "express";
import pingRouter from "./ping.routes";
import userRouter from "./user.routes";
import workspaceRouter from "./workspace.routes";

const v1Router = express.Router();

v1Router.use("/ping", pingRouter);
v1Router.use("/users", userRouter);
v1Router.use("/workspaces", workspaceRouter);

export default v1Router;
