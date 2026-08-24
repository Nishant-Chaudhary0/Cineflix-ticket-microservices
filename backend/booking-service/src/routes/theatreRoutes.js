import express from "express";
import { createTheatre, getAllTheatres } from "../controllers/theatrecontroller.js";

const theatreRouter = express.Router();

theatreRouter.post("/create-theatre", createTheatre);
theatreRouter.get("/get-all-theatres", getAllTheatres);

export default theatreRouter;