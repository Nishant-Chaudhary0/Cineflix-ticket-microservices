import { Show } from "../models/show.js";
import { Theatre } from "../models/theatre.js";
import logger from "../utils/logger.js";

export const createShow = async (req, res) => {
    logger.info("create show endpoint hit...");
    try {
        const{theatre, showTime, showDate, showDay, movie, price} = req.body;
        const theatreData = await Theatre.findById(theatre);
        
        if(!theatreData){
            return res.status(400).json({
                message:"Please provide theatre id..."
            })
        }

        let seats = [];
        for(let r = 0; r < theatreData.row; r++){
            const row = String.fromCharCode(65 + r);
            for(let c = 1; c <= theatreData.column; c++){
                seats.push({
                    seatNumber: `${row}${c}`,
                    status: "available"
                })
            }
        }

        const newlyCreatedShow = await Show.create({theatre, showTime, showDate, showDay, movie, price, seats});
        return res.status(201).json(newlyCreatedShow);
    } catch (error) {
        logger.error("error creating new show...",error);
         return res.status(500).json({
            message:"Internal server error"
        });
    }
};


export const getAllShows = async(req, res) => {
    logger.info("Get all shows endpoint hit...");
    try {
        const allShows = await Show.find();
        return res.status(200).json(allShows);
    } catch (error) {
        logger.error("error fetching all shows");
        return res.status(500).json({
            message:"Internal server error"
        })
    }
};