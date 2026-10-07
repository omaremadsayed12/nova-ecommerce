import mongoose from "mongoose";
import Review from "../../models/Reviews.js";
import { NotFoundError, ValidationError } from "../errors.service.js";
import auth_validator from "./auth.validator.js";

const validate_review_list_params = (params = {}) => {
  const parseInteger = (value, field, fallback, maximum) => {
    if (value === undefined || value === "") return fallback;
    if (typeof value !== "string" && typeof value !== "number") {
      throw new ValidationError({ [field]: "Must be a positive integer" });
    }
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || (maximum && parsed > maximum)) {
      throw new ValidationError({ [field]: `Must be a positive integer${maximum ? ` no greater than ${maximum}` : ""}` });
    }
    return parsed;
  };

  return {
    page: parseInteger(params.page, "page", 1),
    limit: parseInteger(params.limit, "limit", 12, 50),
  };
};

const validate_add_review = async (productId, reviewData, user) => {
  if (!reviewData || typeof reviewData !== "object" || Array.isArray(reviewData) ||
      Object.keys(reviewData).some((key) => !["rating", "comment"].includes(key))) {
    throw new ValidationError({ review: "Provide a rating and optional comment only" });
  }
  const existingReview = await Review.findOne({ product: productId, user: user._id });
  if (existingReview) {
    throw new ValidationError({ review: "User already added review on this product" });
  }

  const { rating, comment = "" } = reviewData;
  if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    throw new ValidationError({ rating: "Rating must be an integer between 1 and 5" });
  }
  if (typeof comment !== "string" || comment.length > 225) {
    throw new ValidationError({ comment: "Comment must be text no longer than 225 characters" });
  }
};

const validate_update_review = async (id, user, reviewData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError({ review: `${id} is not a valid review id` });
  }
  if (!reviewData || typeof reviewData !== "object" || Array.isArray(reviewData)) {
    throw new ValidationError({ review: "Review updates must be an object" });
  }

  const keys = Object.keys(reviewData);
  if (keys.length === 0 || keys.some((key) => !["rating", "comment"].includes(key))) {
    throw new ValidationError({ review: "Provide rating and/or comment only" });
  }

  const review = await Review.findById(id);
  if (!review) throw new NotFoundError({ review: "Review not found" });
  auth_validator.is_owner(user, review);

  if (Object.hasOwn(reviewData, "rating") &&
      (!Number.isInteger(Number(reviewData.rating)) || Number(reviewData.rating) < 1 || Number(reviewData.rating) > 5)) {
    throw new ValidationError({ rating: "Rating must be an integer between 1 and 5" });
  }
  if (Object.hasOwn(reviewData, "comment") &&
      (typeof reviewData.comment !== "string" || reviewData.comment.length > 225)) {
    throw new ValidationError({ comment: "Comment must be text no longer than 225 characters" });
  }

  return review;
};

export default { validate_review_list_params, validate_add_review, validate_update_review };
