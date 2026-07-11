import redis from "../lib/redis.js";
import { Booking } from "../models/booking.js";
import { consumeEvent } from "../utils/rabbitMQ.js";

export const payment_failed = async () => {
  await consumeEvent("booking-service.payment.failed", "payment.failed", async (data) => {
    console.log("payment failed event consumed", data);

    await Booking.findByIdAndUpdate(data.bookingId, {
      paymentstatus: "failed",
    });

    for (const seat of data.seats || []) {
      await redis.del(`seatLock:${data.showId}:${seat}`);
    }
  });
};