import categories_service from "../services/categories.service.js";

const get_all_categories = async (req, res) => {
  const params = req.query;
  const { categories, meta } = await categories_service.get_all_categories(params);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
    error: null,
    meta,
  });
};

export default { get_all_categories };
