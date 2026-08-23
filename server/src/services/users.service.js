import User from "../models/User.js";

const get_all_users = async () => {
  return await User.find();
};

const validate_user_input = async (user_data) => {
  const { name, email, password, role } = user_data;
  const errors = [];
  let isValid = true;
  if (!name || name.length < 2 || name.length > 50) {
    errors.push("Name must be between 2 and 50 characters");
    isValid = false;
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push("Email already exists");
      isValid = false;
    }
  });

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push("Invalid email format");
    isValid = false;
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
    isValid = false;
  }

  if (!["ADMIN", "CUSTOMER"].includes(role)) {
    errors.push("Role must be Admin or Customer");
    isValid = false;
  }

  return { errors, isValid };
};

const validate_user_update_input = async (user_data, user_id) => {
  const { name, email, password, role } = user_data;
  const errors = [];
  let isValid = true;
  if (name && (name.length < 2 || name.length > 50)) {
    errors.push("Name must be between 2 and 50 characters");
    isValid = false;
  }
  if (email) {
    User.findOne({ email }).then((user) => {
      if (user._id != user_id) {
        errors.push("Email already exists");
        isValid = false;
      }
    });
  }

  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push("Invalid email format");
    isValid = false;
  }

  if (password && password.length < 8) {
    errors.push("Password must be at least 8 characters long");
    isValid = false;
  }

  if (role && !["ADMIN", "CUSTOMER"].includes(role)) {
    errors.push("Role must be Admin or Customer");
    isValid = false;
  }

  return { errors, isValid };
};

const check_user = async (user_id) => {
  const user = User.findById(user_id);
  return !!user;
};

const add_user = async (body, creator) => {
  const newUser = new User(body);
  newUser.createdBy = creator._id;
  newUser.updatedBy = creator._id;
  await newUser.save();
  return newUser;
};

const update_user = async (user_id, user_data, updater) => {
  const updateData = Object.fromEntries(
    Object.entries(user_data).filter(([_, value]) => value !== null),
  );
  return await User.findByIdAndUpdate(
    user_id,
    {
      ...updateData,
      updatedBy: updater._id,
    },
    {
      returnDocument: "after",
    },
  );
};

const delete_user = async (user_id) => {
  return await User.findByIdAndDelete(user_id);
};

export default {
  get_all_users,
  validate_user_input,
  validate_user_update_input,
  add_user,
  check_user,
  update_user,
  delete_user,
};
