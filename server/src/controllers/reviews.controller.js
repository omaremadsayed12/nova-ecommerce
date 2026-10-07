import reviews_service from "../services/reviews.service.js";

const get_product_reviews = async (req, res) => {
  const productId = req.params.productId;
  const { reviews, meta } =
    await reviews_service.get_product_reviews(productId, req.query);
  res.status(200).json({
    success: true,
    message: "All product reviews fetched successfully",
    data: reviews,
    error: null,
    meta,
  });
};

const get_user_product_review = async (req, res) => {
  const review = await reviews_service.get_user_product_review(
    req.params.productId,
    req.user,
  );
  res.status(200).json({
    success: true,
    message: "Your product review fetched successfully",
    data: review,
    error: null,
    meta: null,
  });
};

const add_review = async (req, res) => {
  const productId = req.params.productId;
  const user = req.user;
  const reviewData= req.body;
  const review = await reviews_service.add_review(productId, reviewData, user);
  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
    error: null,
    meta: null,
  });
};

const update_review = async (req, res) => {
  const review = await reviews_service.update_review(req.params.id, req.user, req.body);
  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: review,
    error: null,
    meta: null,
  });
};

export default {
  get_product_reviews,
  get_user_product_review,
  add_review,
  update_review,
};
