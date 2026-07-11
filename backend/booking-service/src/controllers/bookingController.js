import express from "express";
import { Booking } from "../models/booking.js";
import logger from "../utils/logger.js";
import redis from "../lib/redis.js";
import { json } from "zod";
import publishEvent from "../utils/rabbitMQ.js";
import { Show } from "../models/show.js";

export const createBooking = async (req, res) => {
    logger.info("Create Booking endpoint hit...");

    const { showId, seats } = req.body;
    const user = req.user.id;

    if (!showId || !seats || seats.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Show ID and seats are required."
        });
    }

    const lockedSeats = [];

    try {

        // Find show
        const show = await Show.findById(showId);

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found."
            });
        }

        // Lock seats in Redis
        for (const seat of seats) {

            const key = `seatLock:${showId}:${seat}`;

            const locked = await redis.set(
                key,
                user,
                "NX",
                "EX",
                300
            );

            if (!locked) {

                // Release previously locked seats
                for (const s of lockedSeats) {
                    await redis.del(`seatLock:${showId}:${s}`);
                }

                return res.status(409).json({
                    success: false,
                    message: `Seat ${seat} is already locked.`
                });
            }

            lockedSeats.push(seat);
        }

        // Calculate total price
        const totalPrice = seats.length * show.price;

        // Create booking
        const booking = await Booking.create({
            user,
            movie: show.movie,
            show: show._id,
            seats,
            totalPrice,
            paymentstatus: "pending"
        });

        // Clear cache
        await redis.del("bookings:all");
        await redis.del(`bookings:${user}`);

        // Publish event to Payment Service
        await publishEvent("new_payment", {
            bookingId: booking._id,
            showId: show._id,
            seats,
            amount: totalPrice
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking
        });

    } catch (error) {

        // Release seat locks
        for (const seat of lockedSeats) {
            await redis.del(`seatLock:${showId}:${seat}`);
        }

        logger.error("Error creating booking", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const getAllBookings = async (req, res) => {
    logger.info("Geta all booking endpoint hit...");

    try {
        const cacheKey = 'bookings:all';
        const cache = await redis.get(cacheKey);
        if (cache) {
            return res.status(200).json(JSON.parse(cache));
        }

        const allBookings = await Booking.find();
        await redis.set(cacheKey, JSON.stringify(allBookings), 'EX', 3600)

        return res.status(200).json(allBookings);
    } catch (error) {
        logger.error("error fetching all bookings", error);
        return res.status(500).json({
            message: "Internal server error..."
        })
    }
}

export const getBookingByUserId = async (req, res) => {
    logger.info("Get all booking by user id endpoint hit...");
    const user = req.user.id;

    if (!user) {
        return res.status(400).json({
            message: "Please provide user id..."
        })
    }

    try {
        const cacheKey = `bookings:${user}`;
        const cache = await redis.get(cacheKey);
        if (cache) {
            return res.status(200).json(JSON.parse(cache));
        }

        // find() not findById(), and filter by the user field, not _id
        const bookings = await Booking.find({ user })
            .populate("movie", "name title image language")
            .populate({
                path: "show",
                select: "showDate showDay showTime theatre",
                populate: { path: "theatre", select: "theatreName" }
            })
            .sort({ createdAt: -1 })
            .lean();

        await redis.set(cacheKey, JSON.stringify(bookings), 'EX', 3600);
        return res.status(200).json(bookings);
    } catch (error) {
        logger.error("error fetching all bookings by user id", error);
        return res.status(500).json({
            message: "Internal server error..."
        })
    }
}


export const getBookingDetail = async() => {
    logger.info("get Booking Detail endpoint hit...");

    const {bookingId} = req.params;

    if(!bookingId){
        logger.info("No booking id");
        return res.status(404).json({
            "message":"No booking found"
        })
    }

    try {
        const result = await Booking.findById(bookingId);

        res.status(202).json(result);
    } catch (error) {
         logger.error("error fetching booking", error);
        return res.status(500).json({
            message: "Internal server error..."
        })
    }
}