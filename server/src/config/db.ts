import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const connectDB = async () => {
  try {
    const mongo_uri = env.mongoUri;
    if (!mongo_uri) throw new Error("Mongo DB URI is empty or invalid");
    await mongoose.connect(mongo_uri);
    logger.info("database connected");
  } catch (e) {
    logger.error(e, "database connection error");
    if (e instanceof Error) {
      throw Error("Database connection error");
    }
  }
};
