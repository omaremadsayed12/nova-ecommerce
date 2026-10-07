import mongoose from "mongoose";
import User from "../../models/User.js";
import { NotFoundError, ValidationError } from "../errors.service.js";

const validate_user_list_params = (params = {}) => {
  const parseInteger = (value, field, fallback, maximum) => {
    if (value === undefined || value === "") return fallback;
    if (typeof value !== "string" && typeof value !== "number") {
      throw new ValidationError({ [field]: "Must be a positive integer" });
    }
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 1 || (maximum && parsed > maximum)) {
      throw new ValidationError({ [field]: `Must be a positive integer${maximum ? ` no greater than ${maximum}` : ""}` });
    }
    return parsed;
  };

  const filters = {
    page: parseInteger(params.page, "page", 1),
    limit: parseInteger(params.limit, "limit", 12, 100),
  };
  if (params.role) {
    if (!["ADMIN", "CUSTOMER"].includes(params.role)) {
      throw new ValidationError({ role: "Invalid user role" });
    }
    filters.role = params.role;
  }
  if (params.search !== undefined) {
    if (typeof params.search !== "string" || params.search.length > 100) {
      throw new ValidationError({ search: "Search must be text no longer than 100 characters" });
    }
    filters.search = params.search.trim();
  }
  return filters;
};

const validate_user_input = async (userData) => {
  if (!userData || typeof userData !== "object" || Array.isArray(userData)) {
    throw new ValidationError({ user: "User data must be an object" });
  }
  const { name, email, password, role } = userData;
  if (!name || typeof name !== "object" || typeof name.en !== "string" || name.en.trim().length < 2 || name.en.trim().length > 50) {
    throw new ValidationError({ name: "English name must be between 2 and 50 characters" });
  }
  if (name.ar && (typeof name.ar !== "string" || name.ar.trim().length < 2 || name.ar.trim().length > 50)) {
    throw new ValidationError({ name: "Arabic name must be between 2 and 50 characters" });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError({ email: "Invalid email format" });
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    throw new ValidationError({ email: "Email already exists" });
  }
  if (typeof password !== "string" || password.length < 8) {
    throw new ValidationError({ password: "Password must be at least 8 characters long" });
  }
  if (role && !["ADMIN", "CUSTOMER"].includes(role)) {
    throw new ValidationError({ role: "Role must be Admin or Customer" });
  }
};

const validate_user_update_input = async (userData, userId) => {
  if (!userData || typeof userData !== "object" || Array.isArray(userData)) {
    throw new ValidationError({ user: "User update must be an object" });
  }
  const allowedFields = new Set(["name", "email", "password", "currentPassword", "role", "imageUrl"]);
  const fields = Object.keys(userData);
  if (fields.length === 0 || fields.some((field) => !allowedFields.has(field))) {
    throw new ValidationError({ user: "Provide at least one supported user field" });
  }

  if (Object.hasOwn(userData, "name")) {
    const name = userData.name;
    const languages = new Set(["en", "ar"]);
    if (!name || typeof name !== "object" || Array.isArray(name) || Object.keys(name).length === 0 || Object.keys(name).some((language) => !languages.has(language))) {
      throw new ValidationError({ name: "Provide English and/or Arabic name fields" });
    }
    for (const [language, value] of Object.entries(name)) {
      if (typeof value !== "string") throw new ValidationError({ name: `${language} name must be text` });
      const trimmed = value.trim();
      if ((language === "en" && (trimmed.length < 2 || trimmed.length > 50)) || (language === "ar" && trimmed !== "" && (trimmed.length < 2 || trimmed.length > 50))) {
        throw new ValidationError({ name: `${language === "en" ? "English" : "Arabic"} name must be between 2 and 50 characters` });
      }
    }
  }

  if (Object.hasOwn(userData, "email")) {
    if (typeof userData.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      throw new ValidationError({ email: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email: userData.email.toLowerCase(), _id: { $ne: userId } });
    if (existingUser) throw new ValidationError({ email: "This email is already used by another user" });
  }
  if (Object.hasOwn(userData, "password") && (typeof userData.password !== "string" || userData.password.length < 8)) {
    throw new ValidationError({ password: "Password must be at least 8 characters long" });
  }
  if (Object.hasOwn(userData, "password") && (typeof userData.currentPassword !== "string" || userData.currentPassword.length < 8)) {
    throw new ValidationError({ currentPassword: "Enter your current password to change it" });
  }
  if (Object.hasOwn(userData, "currentPassword") && !Object.hasOwn(userData, "password")) {
    throw new ValidationError({ currentPassword: "A new password is required" });
  }
  if (Object.hasOwn(userData, "role") && !["ADMIN", "CUSTOMER"].includes(userData.role)) {
    throw new ValidationError({ role: "Role must be Admin or Customer" });
  }
  if (Object.hasOwn(userData, "imageUrl") && typeof userData.imageUrl !== "string") {
    throw new ValidationError({ imageUrl: "Image URL must be text" });
  }
};

const validate_user = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ValidationError({ user: `${userId} is not a valid user id` });
  }
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError({ user: "User not found" });
  return user;
};

export default { validate_user_list_params, validate_user_input, validate_user_update_input, validate_user };
