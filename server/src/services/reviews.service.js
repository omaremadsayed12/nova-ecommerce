import products_validator from "./validators/products.validator.js";
import reviews_validator from "./validators/reviews.validator.js";
import Reviews from "../models/Reviews.js";

const get_product_reviews = async (productId, page, limit) => {
  await products_validator.verify_product(productId);
  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    Reviews.find({ product: productId })
      .select("-product")
      .skip(skip)
      .limit(limit),
    Reviews.countDocuments(),
  ]);
  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return { reviews, meta };
};

const add_review = async (productId, reviewData, user) => {
  await reviews_validator.validate_add_review(productId, reviewData, user);
  const { comment, rating } = reviewData;
  const review = new Reviews({
    product: productId,
    user: user._id,
    comment,
    rating,
  });
  return await review.save();
};

const update_review = async (id, reviewData) => {
  const review = await reviews_validator.validate_update_review(
    id,
    user,
    reviewData,
  );
  const updateData = Object.fromEntries(
    Object.entries(reviewData).filter(([_, value]) => value !== null),
  );
  await review.updateOne({
    ...updateData,
  });
  return review;
};

export default { get_product_reviews, add_review, update_review };
