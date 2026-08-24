import express from "express";
import { createShow, getAllShows, getShowByMovie, getShowByShowId, updateseatStatus } from "../controllers/showController.js";

const showRouter = express.Router();

showRouter.post("/create-show", createShow);
showRouter.get("/get-all-shows", getAllShows);
showRouter.get("/get-show-by-movie/:id", getShowByMovie);
showRouter.get("/get-show-by-showId/:id", getShowByShowId);
showRouter.post("/update-seat", updateseatStatus);

export default showRouter;