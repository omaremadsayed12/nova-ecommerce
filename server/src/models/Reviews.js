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
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

reviewsSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewsSchema);

export default Review;
