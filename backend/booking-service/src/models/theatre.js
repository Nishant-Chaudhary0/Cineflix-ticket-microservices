import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
    theatreName: {
        type: String,
        required: true
    },
    row: Number,
    column: Number
}, { timestamps: true });

export const Theatre = mongoose.model("Theatre", theatreSchema);