import User from "../models/User.js";
import users_validator from "./validators/users.validator.js";
import auth_validator from "./validators/auth.validator.js";

const get_all_users = async (page, limit) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
  return { users, meta };
};

const add_user = async (body, creator) => {
  const { name } = body;
  if (name) {
    const parsedName = JSON.parse(name);
    body.name = parsedName;
  }
  await users_validator.validate_user_input(body);
  const user = new User(body);
  user.createdBy = creator._id;
  user.updatedBy = creator._id;
  return await user.save();
};

const update_user = async (user_id, user_data, updater) => {
  const { name } = user_data;
  if (name) {
    const parsedName = JSON.parse(name);
    user_data.name = parsedName;
  }
  const user = await users_validator.validate_user(user_id);
  await users_validator.validate_user_update_input(user_data);
  await auth_validator.owner_or_admin(updater, user);
  const updateData = Object.fromEntries(
    Object.entries(user_data).filter(([_, value]) => value !== null),
  );
  return await user.updateOne(
    {
      ...updateData,
      updatedBy: updater._id,
    },
    {
      returnDocument: "after",
    },
  );
};

const delete_user = async (user_id, deleter) => {
  const user = await users_validator.validate_user(user_id);
  await auth_validator.owner_or_admin(deleter, user);
  return await user.deleteOne();
};

export default {
  get_all_users,
  add_user,
  update_user,
  delete_user,
};
