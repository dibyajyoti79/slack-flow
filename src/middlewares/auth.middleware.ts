import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/api-error";
import { TokenPayload, verifyToken } from "../utils/jwt";

declare module "express" {
  export interface Request {
    user?: TokenPayload;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token) as TokenPayload;

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
