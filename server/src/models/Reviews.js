import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: {
      type: String,
      maxlength: 225,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Review = mongoose.model("Review", reviewsSchema);

export default Review;
