import express from "express";
import logger from "./utils/logger.js";
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from "./config/db.js";
import movieRouter from "./routes/movieRouter.js";
import bookingRouter from "./routes/bookingRoutes.js";
import showRouter from "./routes/showRouter.js";
import theatreRouter from "./routes/theatreRoutes.js";

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/api/v1/movies",movieRouter);
app.use("/api/v1/bookings",bookingRouter);
app.use("/api/v1/show", showRouter);
app.use("/api/v1/theatre",theatreRouter);

app.listen(PORT,() => {
    logger.info("Booking service server is running on port : ", PORT);
});