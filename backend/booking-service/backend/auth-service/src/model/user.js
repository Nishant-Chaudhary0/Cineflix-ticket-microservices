import mongoose, { Schema } from 'mongoose';

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type:String,
        enum: ["user", "admin"],
        default: "user",
        // required: true
    }
},{timestamps: true});

const User = new mongoose.model("User", userModel);

export default User;