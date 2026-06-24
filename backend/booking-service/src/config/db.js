import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const dbConnect = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        logger.info("successfully connected to Database")
    } catch (error) {
        logger.error("error connecting to Database",error);
        process.exit(1);
    }
}