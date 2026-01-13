import { dbConfig, serverConfig } from ".";
import logger from "./logger.config";
import mongoose from "mongoose";

export default async function connectDB() {
  try {
    if (serverConfig.ENV === "development") {
      await mongoose.connect(dbConfig.DEV_DB_URL);
    } else if (serverConfig.ENV === "production") {
      await mongoose.connect(dbConfig.PROD_DB_URL);
    }
    logger.info(`Connected to ${serverConfig.ENV} database`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
  }
}
