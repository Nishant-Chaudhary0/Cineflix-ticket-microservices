import mongoose, { Schema } from "mongoose";

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    },
    language:{
        type:String,
        required:true
    },
    image: {
        type: String,
        required: true
    },
});

export const Movies = new mongoose.model("Movies", movieSchema);
