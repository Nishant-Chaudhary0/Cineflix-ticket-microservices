import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
  },
  movie:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Movies",
    required: true
  },
  show:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Show",
    required: true
  },
  seats: [String],
  totalPrice: {
    type: Number,
    required: true
  },
  paymentstatus:{
    type:String,
    default:"pending",
    enum: ["success","pending","failed"]
  }
},{timestamps: true});

export const Booking = mongoose.model("Booking", bookingSchema);