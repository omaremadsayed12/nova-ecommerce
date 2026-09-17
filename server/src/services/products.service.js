import Products from "../models/Product.js";
import Reviews from "../models/Reviews.js";
import products_validator from "./validators/products.validator.js";

const get_all_products = async (page, limit) => {
  const skip = (page - 1) * limit;
  const [products, total] = await Promise.all([
    Products.find().skip(skip).limit(limit),
    Products.countDocuments(),
  ]);
  const productIds = products.map((product) => product._id);

  const ratings = await Reviews.aggregate([
    {
      $match: {
        product: { $in: productIds },
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const ratingMap = new Map(
    ratings.map((rating) => [
      rating._id.toString(),
      {
        averageRating: Number(rating.averageRating.toFixed(1)),
      },
    ]),
  );

  const productsWithRatings = products.map((product) => ({
    ...product.toObject(),
    averageRating: ratingMap.get(product._id.toString())?.averageRating || 0,
  }));

  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return { products: productsWithRatings, meta };
};

const get_product_details = async (productId) => {
  return await products_validator.verify_product(productId);
};

const add_product = async (productData, creator) => {
  productData = parse_input(productData);
  products_validator.validate_product_input(productData);
  const product = new Products(productData);
  product.createdBy = creator._id;
  product.updatedBy = creator._id;
  return await product.save();
};

const update_product = async (productId, productData, updater) => {
  productData = parse_input(productData);
  const product = await products_validator.verify_product(productId);
  products_validator.validate_product_update_input(productData);
  const updateData = Object.fromEntries(
    Object.entries(productData).filter(([_, value]) => value !== null),
  );
  await product.updateOne({ ...updateData, updatedBy: updater._id });
  return product;
};

const delete_product = async (productId) => {
  const product = await products_validator.verify_product(productId);
  return await product.deleteOne();
};

const parse_input = (productData) => {
  const { name, description, category } = productData;
  if (name) {
    const parsedName = JSON.parse(name);
    productData.name = parsedName;
  }
  if (description) {
    const parsedDescription = JSON.parse(description);
    productData.description = parsedDescription;
  }
  if (category) {
    const parsedCategory = JSON.parse(category);
    productData.category = parsedCategory;
  }
  return productData;
};

export default {
  get_all_products,
  get_product_details,
  add_product,
  update_product,
  delete_product,
};
