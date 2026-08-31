import Product from "../models/Product.js";
import Order from "../models/Order.js";

const get_stats = async()=>{
  const [totalOrders, totalProducts] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
  ]);
  return [totalOrders, totalProducts];
}

export default {get_stats};