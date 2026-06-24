import express from "express";
import { createShow, getAllShows } from "../controllers/showController.js";

const showRouter = express.Router();

showRouter.post("/create-show", createShow);
showRouter.get("/get-all-shows", getAllShows);

export default showRouter;