import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const get_stats = async () => {
  const [totalOrders, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
  ]);
  return [totalOrders, totalProducts];
};

const get_admin_stats = async () => {
  const [totalOrders, totalProducts, activeProducts, customers, revenueByCurrency, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: "CUSTOMER" }),
    Order.aggregate([
      { $match: { status: "COMPLETED", paymentStatus: "PAID" } },
      { $group: { _id: "$currency", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).select("total currency status paymentStatus createdAt").lean(),
  ]);

  return {
    totalOrders,
    totalProducts,
    activeProducts,
    customers,
    revenueByCurrency: revenueByCurrency.map(({ _id, ...values }) => ({ currency: _id, ...values })),
    recentOrders,
  };
};

export default { get_stats, get_admin_stats };
