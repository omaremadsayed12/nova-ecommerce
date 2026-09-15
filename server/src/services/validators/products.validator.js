import mongoose from "mongoose";
import Product from "../../models/Product.js";
import { NotFoundError, ValidationError } from "../errors.service.js";
import auth_validator from "./auth.validator.js";

const verify_product = async (productId) => {
  const isValidId = mongoose.Types.ObjectId.isValid(productId);
  if (!isValidId) {
    const details = {
      product: `${productId} is not a valid product id`,
    };
    throw new ValidationError(details);
  } else {
    const product = await Product.findById(productId);
    if (!product) {
      const details = {
        product: "Product not found",
      };
      throw new NotFoundError(details);
    } else {
      return product;
    }
  }
};

const validate_product_input = async (productData) => {
  const { name, price, currency, category } = productData;
  if (!name || name.length < 2) {
    const details = {
      name: "Product name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }

  if (!category || category.length < 2) {
    const details = {
      category: "Product category must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (!currency) {
    const details = {
      currency: "Product currency is required",
    };
    throw new ValidationError(details);
  }

  if (!price || price <= 0) {
    const details = {
      price: "Product price must be a positive number",
    };
    throw new ValidationError(details);
  }
};

const validate_product_update_input = async (productData) => {
  const { name, price, category } = productData;

  if (name && name.length < 2) {
    const details = {
      name: "Product name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }

  if (price && price <= 0) {
    const details = {
      price: "Product price must be a positive number",
    };
    throw new ValidationError(details);
  }

  if (category && category.length < 2) {
    const details = {
      category: "Product category must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
};

export default {
  verify_product,
  validate_product_input,
  validate_product_update_input,
};
