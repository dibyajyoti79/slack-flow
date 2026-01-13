import express from "express";
import { serverConfig } from "./config";
import v1Router from "./routes/v1/index.routes";
import { appErrorHandler } from "./middlewares/error.middleware";
import logger from "./config/logger.config";
import { attachCorrelationIdMiddleware } from "./middlewares/correlation.middleware";
import { NotFoundError } from "./utils/api-error";
import connectDB from "./config/db.config";
const app = express();

app.use(express.json());

app.use(attachCorrelationIdMiddleware);
app.use("/api/v1", v1Router);

// NOTFOUND HANDLER
app.use((req, res) => {
  throw new NotFoundError("Route not found");
});

app.use(appErrorHandler);

app.listen(serverConfig.PORT, () => {
  connectDB();
  logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
  logger.info(`Press Ctrl+C to stop the server.`);
});
