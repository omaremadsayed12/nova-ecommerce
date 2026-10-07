import products_validator from "./validators/products.validator.js";
import reviews_validator from "./validators/reviews.validator.js";
import Reviews from "../models/Reviews.js";
import { ValidationError } from "./errors.service.js";

const get_product_reviews = async (productId, params = {}) => {
  const product = await products_validator.verify_product(productId);
  const { page, limit } = reviews_validator.validate_review_list_params(params);
  const skip = (page - 1) * limit;
  const filter = { product: product._id };
  const [reviews, total, rating] = await Promise.all([
    Reviews.find(filter)
      .select("-product -user")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit),
    Reviews.countDocuments(filter),
    Reviews.aggregate([
      { $match: filter },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]),
  ]);
  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    averageRating: Math.round((rating[0]?.averageRating || 0) * 10) / 10,
  };
  return { reviews, meta };
};

const get_user_product_review = async (productId, user) => {
  const product = await products_validator.verify_product(productId);
  return Reviews.findOne({ product: product._id, user: user._id })
    .select("-product -user");
};

const add_review = async (productId, reviewData, user) => {
  await products_validator.verify_product(productId);
  await reviews_validator.validate_add_review(productId, reviewData, user);
  const { comment, rating } = reviewData;
  const review = new Reviews({
    product: productId,
    user: user._id,
    comment,
    rating,
  });
  try {
    return await review.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ValidationError({ review: "User already added review on this product" });
    }
    throw error;
  }
};

const update_review = async (id, user, reviewData) => {
  const review = await reviews_validator.validate_update_review(id, user, reviewData);
  review.set(reviewData);
  return await review.save();
};

export default {
  get_product_reviews,
  get_user_product_review,
  add_review,
  update_review,
};
