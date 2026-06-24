import dotenv from 'dotenv';
dotenv.config();
import { razorpayInstance } from "../config/razorpay.js";
import crypto from 'crypto';

const instance = razorpayInstance;

export const createRazorpayOrder = async (event) => {
    const { showId, amount } = event;

    console.log(event);

    if (!amount || !showId) {
        throw new Error(`Invalid event payload: ${JSON.stringify(event)}`);
    }

    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${showId}`,
    };

    return new Promise((resolve, reject) => {
        instance.orders.create(options, (err, order) => {
            if (err) reject(err);
            else resolve(order);
        });
    });
};

export const createOrder = async (req, res) => {
    try {
        const order = await createRazorpayOrder(req.body);
        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ message: "Error creating order" });
    }
};

export const verifyOrder = (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(order_id + "|" + payment_id);
    const generateSignature = hmac.digest("hex");

    if (generateSignature === signature) {
        return res.status(200).json({ message: "payment verified" });
    } else {
        return res.status(400).json({ message: "Payment not verified" });
    }
};