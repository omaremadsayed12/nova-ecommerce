import reviews_service from "../services/reviews.service.js";

const get_product_reviews = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const productId = req.params.productId;
  const { reviews, meta } =
    await reviews_service.get_product_reviews(productId,page,limit);
  res.status(200).json({
    success: true,
    message: "All product reviews fetched successfully",
    data: reviews,
    error: null,
    meta,
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

const update_review = async (req, res) => {};

export default {
  get_product_reviews,
  add_review,
  update_review,
};
