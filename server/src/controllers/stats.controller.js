import stats_service from "../services/stats.service.js";

const get_stats = async(req, res)=>{
    try {
        const [totalOrders, totalProducts] = await stats_service.get_stats();
        res.status(200).json({
          success: true,
          message: "Stats fetched successfully",
          totalOrders,
          totalProducts
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    
};

export default {get_stats};