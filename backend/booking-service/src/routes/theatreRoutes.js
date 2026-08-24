import express from "express";
import { createTheatre } from "../controllers/theatrecontroller.js";

const theatreRouter = express.Router();

theatreRouter.post("/create-theatre", createTheatre);

export default theatreRouter;