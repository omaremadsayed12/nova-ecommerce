import Product from "../models/Product.js";

const get_all_categories = async (params = {}) => {
  let { sortBy = "count", method = "DESC", page = 1, limit = 12 } = params;

  page = Math.max(Number(page) || 1, 1);
  limit = Math.max(Number(limit) || 0, 0);

  const skip = (page - 1) * limit;
  method = String(method).toUpperCase() === "DESC" ? "DESC" : "ASC";
  const direction = method === "DESC" ? -1 : 1;
  const allowedSortFields = ["count", "slug", "name.en", "name.ar"];
  if (!allowedSortFields.includes(sortBy)) sortBy = "count";

  const sort = { [sortBy]: direction };

  const pipeline = [
    {
      $group: {
        _id: { $toLower: "$category.en" },
        count: { $sum: 1 },
        name: { $first: "$category" },
      },
    },

    {
      $project: {
        _id: 0,
        slug: "$_id",
        name: 1,
        count: 1,
      },
    },

    {
      $sort: sort,
    },
  ];

  if (limit > 0) {
    pipeline.push({ $skip: skip }, { $limit: limit });
  }

  const [categories, totalResult] = await Promise.all([
    Product.aggregate(pipeline),

    Product.aggregate([
      {
        $group: {
          _id: { $toLower: "$category.en" },
        },
      },
      {
        $count: "total",
      },
    ]),
  ]);

  const total = totalResult[0]?.total || 0;
  const meta = {
    page,
    limit,
    total,
    totalPages: limit === 0 ? 1 : Math.ceil(total / limit),
  };

  return {
    categories,
    meta,
  };
};

export default {
  get_all_categories,
};
