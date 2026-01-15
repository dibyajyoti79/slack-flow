import { Socket } from "socket.io";
import { TokenPayload, verifyToken } from "../utils/jwt";
import logger from "../config/logger.config";

// Extend Socket to include user data
declare module "socket.io" {
  interface Socket {
    user?: TokenPayload;
  }
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.warn("Socket connection rejected: No token provided");
      return next(new Error("Authentication token required"));
    }

    const decoded = verifyToken(token) as TokenPayload | null;

    if (!decoded) {
      logger.warn("Socket connection rejected: Invalid token");
      return next(new Error("Invalid or expired token"));
    }

    socket.user = decoded;
    logger.info(`Socket authenticated for user: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error("Socket authentication error", error);
    next(new Error("Authentication failed"));
  }
};
