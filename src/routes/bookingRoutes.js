import express from "express";
import { createBooking, getAllBookings, getBookingByUserId } from "../controllers/bookingController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const bookingRouter = express.Router();

bookingRouter.get("/get-all-bookings", getAllBookings);
bookingRouter.get("/get-all-bookings-by-id",authMiddleware, getBookingByUserId);
bookingRouter.post("/create-booking", authMiddleware, createBooking);

export default bookingRouter;