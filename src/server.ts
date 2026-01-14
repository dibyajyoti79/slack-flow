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

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  messageSocketHandler(io, socket);
  channelSocketHandler(io, socket);
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
