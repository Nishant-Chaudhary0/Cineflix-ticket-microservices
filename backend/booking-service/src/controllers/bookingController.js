import express from "express";
import { Booking } from "../models/booking.js";
import logger from "../utils/logger.js";
import redis from "../lib/redis.js";
import { json } from "zod";
import publishEvent from "../utils/rabbitMQ.js";

export const createBooking = async(req, res) => {
    logger.info("create Booking endpoint hit...");
    const{movie, seats,show, totalPrice, payment} = req.body;
    const user = req.user.id;

    try {
        const newlyCreatedBooking = await Booking.create({user, movie, seats, show, totalPrice});
        await redis.del('bookings:all');
        await redis.del(`bookings:${user}`)

        await publishEvent('new_payment',{
            showId: show,
            amount: totalPrice
        })

        return res.status(201).json(newlyCreatedBooking);
    } catch (error) {
        logger.error("error creating new bookings",error);
        return res.status(500).json({
            message:"Internal server error..."
        })
    }
};

export const getAllBookings = async(req, res) => {
    logger.info("Geta all booking endpoint hit...");

    try {
        const cacheKey = 'bookings:all';
        const cache =  await redis.get(cacheKey);
        if(cache){
            return res.status(200).json(JSON.parse(cache));
        }

        const allBookings = await Booking.find();
        await redis.set(cacheKey, JSON.stringify(allBookings), 'EX', 3600)

        return res.status(200).json(allBookings);
    } catch (error) {
     logger.error("error fetching all bookings",error);
        return res.status(500).json({
            message:"Internal server error..."
        })   
    }
}

export const getBookingByUserId = async(req, res) => {
    logger.info("Get all booking by user id endpoint hit...");
    const user = req.user.userId;

    if(!user){
        return res.status(400).json({
            message:"Please provide user id..."
        })
    }

    try {
        const cacheKey = `bookings:${user}`;
        const cache = await redis.get(cacheKey);
        if(cache){
            return res.status(200).json(JSON.parse(cach));
        }

        const bookingsById = await Booking.findById(user);
        await redis.set(cacheKey, JSON.stringify(bookingsById), 'EX', 3600);
        return res.status(200).json(bookingsById);
    } catch (error) {
        logger.error("error fetching all bookings by user id",error);
        return res.status(500).json({
            message:"Internal server error..."
        })  
    }
}