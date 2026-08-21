import User from "../models/User.js";
import jwt_utils from "../utils/jwt.js";

const validate_user_input = async (name, email, password) => {
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

  return { errors, isValid };
};

const add_user = async (name, email, password) => {
  const newUser = new User({ name, email, password });
  await newUser.save();
  return newUser;
};

const authenticate_user = async (email, password) => {
  email = email.toLowerCase();
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt_utils.generate_token(user);
  return token;
};


export default { validate_user_input, add_user, authenticate_user };
