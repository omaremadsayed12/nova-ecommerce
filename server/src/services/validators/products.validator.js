import mongoose from "mongoose";
import Product from "../../models/Product.js";
import { NotFoundError, ValidationError } from "../errors.service.js";

const verify_product = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ValidationError({ product: `${productId} is not a valid product id` });
  }
  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError({ product: "Product not found" });
  return product;
};

const validate_product_input = (productData) => {
  const { name, price, currency, category } = productData;
  const englishName = name.en;
  const arabicName = name.ar;
  if (!englishName || englishName.length < 2) {
    throw new ValidationError({ name: "English name must be at least 2 characters long" });
  }
  if (arabicName && arabicName.length < 2) {
    throw new ValidationError({ name: "Arabic name must be at least 2 characters long" });
  }
  const englishCategory = category.en;
  const arabicCategory = category.ar;
  if (!englishCategory || englishCategory.length < 2) {
    throw new ValidationError({ category: "English category must be at least 2 characters long" });
  }
  if (arabicCategory && arabicCategory.length < 2) {
    throw new ValidationError({ category: "Arabic category must be at least 2 characters long" });
  }
  if (!currency) throw new ValidationError({ currency: "Product currency is required" });
  if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    throw new ValidationError({ price: "Product price must be a positive number" });
  }
};

const validate_product_update_input = (productData) => {
  if (!productData || typeof productData !== "object" || Array.isArray(productData)) {
    throw new ValidationError({ product: "Product update must be an object" });
  }
  const allowedFields = new Set(["name", "description", "category", "price", "currency", "imageUrl", "stock", "isActive"]);
  const fields = Object.keys(productData);
  if (fields.length === 0 || fields.some((field) => !allowedFields.has(field))) {
    throw new ValidationError({ product: "Provide at least one supported product field" });
  }

  for (const field of ["name", "description", "category"]) {
    if (!Object.hasOwn(productData, field)) continue;
    const values = productData[field];
    const validLanguages = new Set(["en", "ar"]);
    if (!values || typeof values !== "object" || Array.isArray(values) || Object.keys(values).length === 0 || Object.keys(values).some((language) => !validLanguages.has(language))) {
      throw new ValidationError({ [field]: "Provide English and/or Arabic text fields" });
    }
    for (const [language, value] of Object.entries(values)) {
      if (typeof value !== "string") throw new ValidationError({ [field]: `${language} value must be text` });
      if (field !== "description" && ((language === "en" && value.trim().length < 2) || (language === "ar" && value !== "" && value.trim().length < 2))) {
        throw new ValidationError({ [field]: `${language === "en" ? "English" : "Arabic"} ${field} must be at least 2 characters long` });
      }
    }
  }

  if (Object.hasOwn(productData, "price") && (!Number.isFinite(Number(productData.price)) || Number(productData.price) <= 0)) {
    throw new ValidationError({ price: "Product price must be a positive number" });
  }
  if (Object.hasOwn(productData, "stock") && (!Number.isSafeInteger(Number(productData.stock)) || Number(productData.stock) < 0)) {
    throw new ValidationError({ stock: "Stock must be a non-negative integer" });
  }
  if (Object.hasOwn(productData, "currency") && (typeof productData.currency !== "string" || !productData.currency.trim())) {
    throw new ValidationError({ currency: "Currency must be a non-empty string" });
  }
  if (Object.hasOwn(productData, "imageUrl") && typeof productData.imageUrl !== "string") {
    throw new ValidationError({ imageUrl: "Image URL must be text" });
  }
  if (Object.hasOwn(productData, "isActive") && ![true, false, "true", "false"].includes(productData.isActive)) {
    throw new ValidationError({ isActive: "Product active state must be true or false" });
  }
};

export default { verify_product, validate_product_input, validate_product_update_input };
