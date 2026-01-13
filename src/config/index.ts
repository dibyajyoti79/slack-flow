import dotenv from "dotenv";
import logger from "./logger.config";

type ServerConfig = {
  PORT: number;
  ENV: string;
};
type DbConfig = {
  DEV_DB_URL: string;
  PROD_DB_URL: string;
};

function loadEnv() {
  dotenv.config();
  logger.info("Loaded environment variables from .env file");
}

loadEnv();

export const serverConfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 3001,
  ENV: process.env.NODE_ENV || "development",
};

export const dbConfig: DbConfig = {
  DEV_DB_URL:
    process.env.DEV_DB_URL || "mongodb://localhost:27017/slack-flow-dev",
  PROD_DB_URL:
    process.env.PROD_DB_URL || "mongodb://localhost:27017/slack-flow-prod",
};
