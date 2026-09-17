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

const validate_product_input = (productData) => {
  const { name, price, currency, category } = productData;
  const englishName = name.en;
  const arabicName = name.ar;
  if (!englishName || englishName.length < 2) {
    const details = {
      name: "English name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (arabicName && arabicName.length < 2) {
    const details = {
      name: "Arabic name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  const englishCategory = category.en;
  const arabicCategory = category.ar;
  if (!englishCategory || englishCategory.length < 2) {
    const details = {
      category: "English category must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (arabicCategory && arabicCategory.length < 2) {
    const details = {
      category: "Arabic category must be at least 2 characters long",
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

const validate_product_update_input = (productData) => {
  const { name, price, category } = productData;
  const englishName = name.en;
  const arabicName = name.ar;
  if (englishName && englishName.length < 2) {
    const details = {
      name: "English name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (arabicName && arabicName.length < 2) {
    const details = {
      name: "Arabic name must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (price && price <= 0) {
    const details = {
      price: "Product price must be a positive number",
    };
    throw new ValidationError(details);
  }
  const englishCategory = category.en;
  const arabicCategory = category.ar;
  if (englishCategory && englishCategory.length < 2) {
    const details = {
      category: "English category must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
  if (arabicCategory && arabicCategory.length < 2) {
    const details = {
      category: "Arabic category must be at least 2 characters long",
    };
    throw new ValidationError(details);
  }
};

export default {
  verify_product,
  validate_product_input,
  validate_product_update_input,
};
