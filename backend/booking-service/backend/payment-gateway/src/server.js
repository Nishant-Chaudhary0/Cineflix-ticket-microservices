import 'dotenv/config'; 
import express from "express";
import cors from 'cors';
import paymentRoute from "./routes/paymentRoute.js";
import { connectRabbitmq, consumeEvent } from './utils/rabbitMQ.js';
import { createRazorpayOrder } from './controllers/razorpayController.js';

console.log(process.env.RAZORPAY_KEY_ID);
const app = express();

const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors());
app.use("/v1/api/payments", paymentRoute);

async function startServer() {
    try {
        await connectRabbitmq();
        await consumeEvent('new_payment', createRazorpayOrder);

        app.listen(PORT, () => {
        console.log(`payment service is running on port : ${PORT}`);
        })


    } catch (error) {
        console.log("Error starting server", error);
        process.exit(1);
    }
}

startServer();