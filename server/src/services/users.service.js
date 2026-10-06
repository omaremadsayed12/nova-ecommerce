import User from "../models/User.js";
import users_validator from "./validators/users.validator.js";
import auth_validator from "./validators/auth.validator.js";
import { AuthorizationError, ValidationError } from "./errors.service.js";

const get_all_users = async (page, limit) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  const meta = { page, limit, total, totalPages: Math.ceil(total / limit) };
  return { users, meta };
};

const add_user = async (body, creator) => {
  const userData = parse_input(body);
  await users_validator.validate_user_input(userData);
  const user = new User(userData);
  user.createdBy = creator._id;
  user.updatedBy = creator._id;
  return await user.save();
};

const update_user = async (userId, userData, updater) => {
  userData = parse_input(userData);
  userData = Object.fromEntries(Object.entries(userData).filter(([, value]) => value !== null && value !== undefined));
  const user = await users_validator.validate_user(userId);
  await users_validator.validate_user_update_input(userData, userId);
  auth_validator.owner_or_admin(updater, user);
  if (updater.role !== "ADMIN" && Object.hasOwn(userData, "role")) {
    throw new AuthorizationError({ user: "Only an admin can change a user's role" });
  }

  const updateData = {};
  for (const [field, value] of Object.entries(userData)) {
    if (field === "name") {
      for (const [language, text] of Object.entries(value)) updateData[`name.${language}`] = text;
    } else if (field === "email") {
      updateData.email = value.toLowerCase();
    } else {
      updateData[field] = value;
    }
  }

  user.set({ ...updateData, updatedBy: updater._id });
  return await user.save();
};

const delete_user = async (userId, deleter) => {
  const user = await users_validator.validate_user(userId);
  auth_validator.owner_or_admin(deleter, user);
  return await user.deleteOne();
};

const parse_input = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError({ user: "User data must be an object" });
  }
  const parsed = { ...body };
  if (typeof parsed.name === "string") {
    try {
      parsed.name = JSON.parse(parsed.name);
    } catch {
      throw new ValidationError({ name: "Invalid name data" });
    }
  }
  return parsed;
};

export default { get_all_users, add_user, update_user, delete_user };
