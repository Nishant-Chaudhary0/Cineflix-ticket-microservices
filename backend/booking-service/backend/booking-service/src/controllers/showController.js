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

        const newlyCreatedShow = await Show.create({theatre, showTime, showDate, showDay, movie, price, seatsAvailable:seats});
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

export const getShowByMovie = async(req, res) => {
    logger.info("Get show by movie endpoint hit...");
    const movieId = req.params.id;

    if(!movieId){
        logger.error("movie id not provided");
        return res.status(404).json({
            message:"movie id not provided"
        })
    }

    try {
       const result = await Show.find({ movie: movieId }).populate("theatre", "theatreName")

        if(!result){
            logger.info("No show for such movie");
            return res.status(404).json({
                message:"No show for this movie"
            })
        }

        return res.json(result);
    } catch (error) {
        logger.error("error in get show by movie route",error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getShowByShowId = async(req, res) => {
    logger.info("Get show by show id endpoint hit");

    const {id} = req.params;
    if(!id){
        logger.info("please provide show id")
        return res.status(404).json({
            message:"Invalid show"
        })
    }

    try {
        const result = await Show.findById(id)
        res.status(201).json(result);
    } catch (error) {
         logger.error("error in get show by showid route",error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const updateseatStatus = async(req, res) => {
    logger.info("update seat status endpoint hit...");

    const seat = req.body;
    try {
        const result = await Show.find(seat);
        console.log(result);
    } catch (error) {
         logger.error("error updating seat",error);
    }
}