import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: [true, "Product name is required"],
      },
      ar: {
        type: String,
      },
    },
    description: {
      en: {
        type: String,
      },
      ar: {
        type: String,
      },
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    category: {
      en: {
        type: String,
        required: [true, "Category is required"],
      },
      ar: {
        type: String,
      },
    },
    currency: {
      type: String,
      default: "USD",
    },
    imageUrl: {
      type: String,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.methods.toJSON = function () {
  const product = this.toObject();

  delete product.createdBy;
  delete product.updatedBy;

  return product;
};

const Product = mongoose.model("Product", productSchema);

export default Product;
