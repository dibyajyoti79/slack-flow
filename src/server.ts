import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { serverConfig } from "./config";
import v1Router from "./routes/v1/index.routes";
import { appErrorHandler } from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { NotFoundError } from "./utils/api-error";
import connectDB from "./config/db.config";
import "./workers/mail.worker";
import { setupBullBoard } from "./utils/helpers/bull-board.helper";
import { messageSocketHandler } from "./controllers/messageSocket.controller";
import { channelSocketHandler } from "./controllers/channelSocket.controller";
import { socketAuthMiddleware } from "./middlewares/socketAuth.middleware";
import { socketService } from "./services/socket.service";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket authentication middleware
io.use(socketAuthMiddleware);

io.on("connection", async (socket) => {
  const userId = socket.user?.id;
  logger.info(`Socket connected: ${socket.id}, User: ${userId}`);

  // Auto-join user to all their channels and DM rooms
  if (userId) {
    await socketService.autoJoinUserRooms(socket, userId);
  }

  messageSocketHandler(io, socket);
  channelSocketHandler(io, socket);

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

app.use(express.json());

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);

// BULL BOARD
const bullBoardAdapter = setupBullBoard();
app.use("/admin/queues", bullBoardAdapter.getRouter());

// NOTFOUND HANDLER
app.use((req, res) => {
  throw new NotFoundError("Route not found");
});

app.use(appErrorHandler);

server.listen(serverConfig.PORT, () => {
  connectDB();
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
