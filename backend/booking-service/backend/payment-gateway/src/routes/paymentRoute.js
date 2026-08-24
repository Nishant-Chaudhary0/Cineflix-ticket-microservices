import express from "express";
import { createOrder, verifyOrder } from "../controllers/razorpayController.js";

const paymentRoute = express.Router();

paymentRoute.post("/create-order", createOrder);
paymentRoute.post("/verify-payment", verifyOrder)

export default paymentRoute;

// http://localhost:3003/v1/api/payment/verify-payment