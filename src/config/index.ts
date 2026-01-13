import dotenv from "dotenv";
import logger from "./logger.config";
import jwt from "jsonwebtoken";

type ServerConfig = {
  PORT: number;
  ENV: string;
  JWT_SECRET: jwt.Secret;
  JWT_EXPIRY: jwt.SignOptions["expiresIn"];
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
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRY: (process.env.JWT_EXPIRY as jwt.SignOptions["expiresIn"]) || "1d",
};

export const dbConfig: DbConfig = {
  DEV_DB_URL:
    process.env.DEV_DB_URL || "mongodb://localhost:27017/slack-flow-dev",
  PROD_DB_URL:
    process.env.PROD_DB_URL || "mongodb://localhost:27017/slack-flow-prod",
};
