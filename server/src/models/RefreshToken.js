import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        jwtid: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        }
    }
);

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;