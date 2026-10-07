import mongoose from "mongoose";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import users_validator from "./validators/users.validator.js";
import auth_validator from "./validators/auth.validator.js";
import { AuthorizationError, ValidationError } from "./errors.service.js";

const get_all_users = async (params = {}) => {
  const { page, limit, role, search } = users_validator.validate_user_list_params(params);
  const skip = (page - 1) * limit;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { email: { $regex: escapedSearch, $options: "i" } },
      { "name.en": { $regex: escapedSearch, $options: "i" } },
      { "name.ar": { $regex: escapedSearch, $options: "i" } },
    ];
  }
  const [users, total] = await Promise.all([
    User.find(filter).select("_id name email role imageUrl createdAt").sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
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
  auth_validator.owner_or_admin(updater, user);
  await users_validator.validate_user_update_input(userData, userId);
  if (updater.role !== "ADMIN" && Object.hasOwn(userData, "role")) {
    throw new AuthorizationError({ user: "Only an admin can change a user's role" });
  }
  if (updater._id.equals(user._id) && userData.role && userData.role !== user.role) {
    throw new ValidationError({ role: "You cannot change your own role" });
  }

  const passwordChanged = Object.hasOwn(userData, "password");
  const targetUser = passwordChanged
    ? await User.findById(userId).select("+password +tokenVersion")
    : user;
  if (!targetUser) {
    throw new ValidationError({ user: "User no longer exists" });
  }
  if (passwordChanged && !await targetUser.comparePassword(userData.currentPassword)) {
    throw new ValidationError({ currentPassword: "Current password is incorrect" });
  }

  const updateData = {};
  for (const [field, value] of Object.entries(userData)) {
    if (field === "name") {
      for (const [language, text] of Object.entries(value)) updateData[`name.${language}`] = text;
    } else if (field === "email") {
      updateData.email = value.toLowerCase();
    } else if (field !== "currentPassword") {
      updateData[field] = value;
    }
  }

  targetUser.set({ ...updateData, updatedBy: updater._id });
  if (passwordChanged) {
    targetUser.tokenVersion = Number(targetUser.tokenVersion ?? 0) + 1;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await targetUser.save({ session });
        await RefreshToken.deleteMany({ user: targetUser._id }, { session });
      });
      return targetUser;
    } finally {
      await session.endSession();
    }
  }
  return await targetUser.save();
};

const delete_user = async (userId, deleter) => {
  const user = await users_validator.validate_user(userId);
  auth_validator.owner_or_admin(deleter, user);
  if (deleter._id.equals(user._id)) {
    throw new ValidationError({ user: "You cannot delete your own account from this action" });
  }
  await RefreshToken.deleteMany({ user: user._id });
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
