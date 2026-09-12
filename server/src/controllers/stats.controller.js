import stats_service from "../services/stats.service.js";

const get_stats = async (req, res) => {
  const [totalOrders, totalProducts] = await stats_service.get_stats();
  res.status(200).json({
    success: true,
    message: "Stats fetched successfully",
    data: {totalOrders,
    totalProducts},
    error: null,
    meta: null
  });
};

export default { get_stats };
