import Products from "../models/Product.js";
import Reviews from "../models/Reviews.js";
import products_validator from "./validators/products.validator.js";
import { ValidationError } from "./errors.service.js";

const get_all_products = async (params = {}) => {
  let {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    method = "ASC",
    category,
    minPrice,
    maxPrice,
    query,
    minRating,
  } = params;

  page = Math.max(Number(page) || 1, 1);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  method = method.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const direction = method === "DESC" ? -1 : 1;

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "price",
    "averageRating",
    "name.en",
    "name.ar",
  ];

  if (!allowedSortFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  const sort = {
    [sortBy]: direction,
  };

  const filter = {};

  const categories = Array.isArray(category)
    ? category
    : category
      ? [category]
      : [];

  if (minPrice !== undefined && minPrice !== "") {
    filter.price = {
      ...(filter.price || {}),
      $gte: Number(minPrice),
    };
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    filter.price = {
      ...(filter.price || {}),
      $lte: Number(maxPrice),
    };
  }

  if (query?.trim()) {
    const searchQuery = query.trim();

    filter.$or = [
      {
        "name.en": {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        "name.ar": {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        "category.en": {
          $regex: searchQuery,
          $options: "i",
        },
      },
      {
        "category.ar": {
          $regex: searchQuery,
          $options: "i",
        },
      },
    ];
  }

  const pipeline = [
    {
      $match: filter,
    },
      ...(categories.length > 0
    ? [
        {
          $match: {
            $expr: {
              $in: [
                { $toLower: "$category.en" },
                categories,
              ],
            },
          },
        },
      ]
    : []),
    {
      $lookup: {
        from: Reviews.collection.name,

        let: {
          productId: "$_id",
        },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$product", "$$productId"],
              },
            },
          },

          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$rating",
              },
              reviewCount: {
                $sum: 1,
              },
            },
          },
        ],

        as: "ratingData",
      },
    },

    {
      $set: {
        averageRating: {
          $round: [
            {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$ratingData.averageRating",
                    0,
                  ],
                },
                0,
              ],
            },
            1,
          ],
        },

        reviewCount: {
          $ifNull: [
            {
              $arrayElemAt: [
                "$ratingData.reviewCount",
                0,
              ],
            },
            0,
          ],
        },
      },
    },
    ...(minRating !== undefined && minRating !== ""
      ? [
          {
            $match: {
              averageRating: {
                $gte: Number(minRating),
              },
            },
          },
        ]
      : []),
    {
      $facet: {
        products:
          limit === 0
            ? [
                {
                  $sort: sort,
                },
              ]
            : [
                {
                  $sort: sort,
                },
                ...(skip > 0
                  ? [
                      {
                        $skip: skip,
                      },
                    ]
                  : []),
                {
                  $limit: limit,
                },
              ],

        total: [
          {
            $count: "count",
          },
        ],
      },
    },
  ];

  const [result] = await Products.aggregate(pipeline);

  const products = result?.products || [];

  const total = result?.total?.[0]?.count || 0;

  const meta = {
    page,
    limit,
    total,
    totalPages:
      limit === 0
        ? 1
        : Math.ceil(total / limit),
  };

  return {
    products,
    meta,
  };
};

const get_product_details = async (productId) => {
  return await products_validator.verify_product(productId);
};

const get_related_products = async (productId, requestedLimit = 4) => {
  const product = await products_validator.verify_product(productId);
  const limit = Number(requestedLimit);
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 12) {
    throw new ValidationError({ limit: "Limit must be an integer between 1 and 12" });
  }
  const category = product.category?.en;
  if (!category) return [];
  const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Products.aggregate([
    {
      $match: {
        _id: { $ne: product._id },
        isActive: true,
        "category.en": { $regex: `^${escapedCategory}$`, $options: "i" },
      },
    },
    {
      $lookup: {
        from: Reviews.collection.name,
        let: { productId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$product", "$$productId"] } } },
          { $group: { _id: null, averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
        ],
        as: "ratingData",
      },
    },
    {
      $set: {
        averageRating: { $round: [{ $ifNull: [{ $arrayElemAt: ["$ratingData.averageRating", 0] }, 0] }, 1] },
        reviewCount: { $ifNull: [{ $arrayElemAt: ["$ratingData.reviewCount", 0] }, 0] },
      },
    },
    { $project: { createdBy: 0, updatedBy: 0, ratingData: 0 } },
    { $sort: { createdAt: -1, _id: -1 } },
    { $limit: limit },
  ]);
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
  productData = Object.fromEntries(
    Object.entries(productData).filter(([, value]) => value !== null && value !== undefined),
  );
  products_validator.validate_product_update_input(productData);

  const updateData = {};
  for (const [field, value] of Object.entries(productData)) {
    if (["name", "description", "category"].includes(field)) {
      for (const [language, text] of Object.entries(value)) {
        updateData[`${field}.${language}`] = text;
      }
    } else if (field === "price" || field === "stock") {
      updateData[field] = Number(value);
    } else if (field === "isActive") {
      updateData[field] = value === true || value === "true";
    } else {
      updateData[field] = value;
    }
  }

  product.set({ ...updateData, updatedBy: updater._id });
  return await product.save();
};
const delete_product = async (productId) => {
  const product = await products_validator.verify_product(productId);
  return await product.deleteOne();
};

const parse_input = (productData) => {
  if (!productData || typeof productData !== "object" || Array.isArray(productData)) {
    throw new ValidationError({ product: "Product data must be an object" });
  }
  const parsed = { ...productData };
  for (const field of ["name", "description", "category"]) {
    if (typeof parsed[field] !== "string") continue;
    try {
      parsed[field] = JSON.parse(parsed[field]);
    } catch {
      throw new ValidationError({ [field]: `Invalid ${field} data` });
    }
  }
  return parsed;
};
export default {
  get_all_products,
  get_product_details,
  get_related_products,
  add_product,
  update_product,
  delete_product,
};
