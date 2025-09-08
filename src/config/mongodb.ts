

import mongoose from "mongoose";
import config from "../config";
import logger from "../logger";

export const connectToDatabase = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      throw new Error("MongoDB connection string is not defined in .env");
    }

    await mongoose.connect(config.mongoUri); // TS is happy, because we checked
    logger.info(`✅ Database connected to MongoDB at ${config.mongoUri}`);
  } catch (err) {
    logger.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  }
};
