import mongoose, { Schema } from "mongoose";

const showSchema = new mongoose.Schema({
  theatre:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theatre",
    required: true
  },
  showTime:{
    type: String,
    required: true
  },
  showDate:{
    type: String,
    required: true
  },
  showDay:{
    type: String,
    required: true
  },
  movie:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Movie",
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  seatsAvailable:[
    {
      seatNumber: String,
      status:{
        type:String,
        enum:["available","booked"],
        default: "available"
      }
    }
  ]
},{timestamps: true});

export const Show = mongoose.model("Show", showSchema);