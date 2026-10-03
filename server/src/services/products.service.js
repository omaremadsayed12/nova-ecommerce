import Products from "../models/Product.js";
import Reviews from "../models/Reviews.js";
import products_validator from "./validators/products.validator.js";

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
