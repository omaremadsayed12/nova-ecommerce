import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt_utils from "../utils/jwt.js";

const validate_user_input = async (name, email, password, imageUrl) => {
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

const add_user = async (name, email, password, imageUrl) => {
  const newUser = new User({ name, email, password, imageUrl });
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
  const jwtid = crypto.randomUUID();
  const refresh_token = jwt_utils.generate_refresh_token(user, jwtid);
  await RefreshToken.findOneAndUpdate(
    { user: user._id },
    {
      jwtid: jwtid,
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );
  const access_token = jwt_utils.generate_access_token(user);
  return { refresh_token, access_token };
};

const refresh_token = async (token) => {
  const decoded = jwt_utils.verify_refresh_token(token);
  const refresh_token = await RefreshToken.findOne({jwtid: decoded.jti});
  if (!refresh_token){
    throw new Error("Invalid refresh token");
  }
  const user = await User.findById(decoded.userId);
  const access_token = jwt_utils.generate_access_token(user);
  return access_token;
};

// const get_user_by_id = async (token) => {
//   const decoded = jwt_utils.decode_token(token);
//   const user = await User.findById(decoded.userId);
//   return user;
// };

const delete_token = async (token)=>{
  const decoded = jwt_utils.verify_refresh_token(token);
  const jwtid = decoded.jti;
  return await RefreshToken.deleteOne({jwtid: jwtid});
}

export default {
  validate_user_input,
  add_user,
  authenticate_user,
  refresh_token,
  delete_token
};
