import logger from "../../../auth-service/src/utils/logger.js";
import redis from "../lib/redis.js";
import { Movies } from "../models/movie.js";
import { movieSchemaValidation } from "../utils/validation.js";

export const createMovie = async (req, res) => {
    logger.info("create movie endpoint hit...")
    const isValid = movieSchemaValidation.safeParse(req.body);

    if (!isValid.success) {
        return res.status(400).json({
            message: "Please provide valid credentials..."
        })
    }

    try {
        const { name, releaseDate, description, genre, duration, language, image } = req.body;
        const newlyCreatedMovie = await Movies.create({
            name, releaseDate, description, genre, duration, language, image
        })

        await redis.del('movies:all');
        await redis.del(`genre:${genre}`);
        const cacheKey = `movies:${newlyCreatedMovie._id}`
        redis.set(cacheKey, JSON.stringify(newlyCreatedMovie), 'EX', 3600)

        res.status(201).json(newlyCreatedMovie);
    } catch (error) {
        logger.error("error while creating new movie...", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getAllMovies = async (req, res) => {
    logger.info("get all movie endpoint hit...");
    const cacheKey = 'movies:all'
    const cache = await redis.get(cacheKey);
    if(cache){
        return res.status(200).json(JSON.parse(cache));
    }

    try {
        const allMovies = await Movies.find();
        await redis.set(cacheKey, JSON.stringify(allMovies), 'EX', 3600);

        res.status(200).json(allMovies);
    } catch (error) {
        logger.error("error while fetching all movie...", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getMovieById = async (req, res) => {
    logger.info("get movie by id endpoint hit...");
    const movieId = req.params.movieId;
    if (!movieId) {
        return res.status(403).json({
            message: "Please provide user id..."
        })
    }

    try {
        const cacheKey = `movies:${movieId}`;
        const cache = await redis.get(cacheKey);
        if (cache) {
            logger.info("cache hit - movie fetched from redis");
            return res.status(200).json(JSON.parse(cache));
        }

        const movie = await Movies.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                message: "Movie not found..."
            });
        }

        redis.set(cacheKey, JSON.stringify(movie), 'EX', 3600);
        return res.status(200).json(movie);
    } catch (error) {
        logger.error("error while fetching all movie...", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getMovieGenre = async (req, res) => {
    logger.info("Get movie by genre endpoint hit...");
    const genre = req.params.genre;
    const cacheKey = `genre:${genre}`;
    const cache = await redis.get(`genre:all`);
    if(cache){
        return res.status(200).json(JSON.parse(cache));
    }

    if (!genre) {
        return res.status(400).json({
            message: "Please provide genre"
        })
    }

    try {
        const movie = await Movies.find({ genre });

        if (movie.length == 0) {
            return res.status(400).json({
                message: "Please provide valid genre"
            })
        }

        await redis.set(cacheKey, JSON.stringify(movie), "EX", 3600);

        return res.status(200).json(movie);
    } catch (error) {
        logger.error("error getting movies by genre...", error);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}