import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({
                message:"no token provided..."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

console.log("Decoded Token:", decoded);

req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message:"Invalid token",
           
        })
        logger.error(error)
    }
};