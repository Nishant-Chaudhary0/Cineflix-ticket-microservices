import express from "express";
import { createShow, getAllShows, getShowByMovie } from "../controllers/showController.js";

const showRouter = express.Router();

showRouter.post("/create-show", createShow);
showRouter.get("/get-all-shows", getAllShows);
showRouter.get("/get-show-by-movie/:id", getShowByMovie);

export default showRouter;