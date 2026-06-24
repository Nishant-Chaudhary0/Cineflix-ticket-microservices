import { Theatre } from "../models/theatre.js";
import logger from "../utils/logger.js"
import { theatreSchemaValidation } from "../utils/validation.js";

export const createTheatre = async(req, res) => {
    logger.info("create theatre endpoint hit...");
    const isValid = theatreSchemaValidation.safeParse(req.body);
    if(!isValid){
        return res.status(400).json({
            message:"please provide valid credentials.."
        })
    }

    try {
        const{theatreName, row, column} = req.body;
        const newlyCreatedTheatre = await Theatre.create({theatreName, row, column});

        res.status(200).json(newlyCreatedTheatre);
    } catch (error) {
        logger.error("error creating new theatre...",error);
        res.status(500).json({
            message:"Internal server error..."
        })
    }
}