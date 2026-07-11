import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
    try {
        console.log("Auth middleware hit");


        const token = req.headers.authorization?.split(" ")[1];


        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);


        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error);

        return res.status(401).json({
            message: error.message
        });
    }
};