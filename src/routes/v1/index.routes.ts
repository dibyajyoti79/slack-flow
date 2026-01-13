import express from "express";
import pingRouter from "./ping.routes";
import userRouter from "./user.routes";

const v1Router = express.Router();

v1Router.use("/ping", pingRouter);
v1Router.use("/users", userRouter);

export default v1Router;
