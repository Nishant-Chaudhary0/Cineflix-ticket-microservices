import dotenv from "dotenv";
dotenv.config();

import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import { publishEvent } from "../utils/rabbitMQ.js";

const instance = razorpayInstance

export const createRazorpayOrder = async (event) => {
    const { bookingId, showId, seats, amount } = event;

    if (!amount || !showId || !bookingId) {
        throw new Error(`Invalid event payload: ${JSON.stringify(event)}`);
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${bookingId}`,
        notes: {
            bookingId,
            showId,
            seats: JSON.stringify(seats),
        },
    };

    return new Promise((resolve, reject) => {
        instance.orders.create(options, (err, order) => {
            if (err) reject(err);
            else resolve(order);
        });
    });
};

export const createOrder = async (req, res) => {
    console.log("create order endpoint hit...")
    try {
        const order = await createRazorpayOrder(req.body);
        return res.status(201).json(order);
    } catch (error) {
        const { bookingId, showId, seats } = req.body;

        await publishEvent("payment.failed", {
            bookingId,
            showId,
            seats,
        });

        return res.status(500).json({
            message: "Error creating order",
        });
    }
};

export const verifyOrder = async (req, res) => {
        console.log(req.body);
    try {
        const {
            bookingId,
            showId,
            seats,
            order_id,
            payment_id,
            signature,
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;

        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(`${order_id}|${payment_id}`);

        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === signature) {

            await publishEvent("payment.success", {
                bookingId,
                showId,
                seats,
                paymentId: payment_id,
                orderId: order_id,
            });

            

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        }

        await publishEvent("payment.failed", {
            bookingId,
            showId,
            seats,
        });

        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};