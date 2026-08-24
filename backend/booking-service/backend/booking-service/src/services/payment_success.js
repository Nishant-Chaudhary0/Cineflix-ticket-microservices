import redis from "../lib/redis.js";
import { Booking } from "../models/booking.js";
import { Show } from "../models/show.js";
import { consumeEvent } from "../utils/rabbitMQ.js";

export const payment_success = async () => {
  await consumeEvent("booking-service.payment.success", "payment.success", async (data) => {
    console.log("payment success event consumed", data);

    await Booking.findByIdAndUpdate(data.bookingId, {
      paymentstatus: "success",
    });

    if (data.seats?.length) {
      await Show.updateOne(
        { _id: data.showId },
        {
          $set: {
            "seatsAvailable.$[seat].status": "booked",
          },
        },
        {
          arrayFilters: [
            {
              "seat.seatNumber": {
                $in: data.seats,
              },
            },
          ],
        }
      );
    }

    for (const seat of data.seats || []) {
      await redis.del(`seatLock:${data.showId}:${seat}`);
    }
  });
};