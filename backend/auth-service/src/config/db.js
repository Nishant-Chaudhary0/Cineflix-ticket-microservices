import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const dbConnect = (req, res) => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        logger.info("Successfully connected to Database");
    } catch (error) {
        logger.error("error connecting to Database");
        process.exit(1);
    }
}