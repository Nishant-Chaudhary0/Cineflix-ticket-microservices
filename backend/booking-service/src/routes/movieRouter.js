import express from "express";
import { createMovie, getAllMovies, getMovieById, getMovieGenre } from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.post("/create-movie", createMovie);
movieRouter.get("/get-all-movies", getAllMovies);
movieRouter.get("/get-movie-by-id/:movieId", getMovieById);
movieRouter.get("/get-movie-by-genre/:genre",getMovieGenre);

export default movieRouter;