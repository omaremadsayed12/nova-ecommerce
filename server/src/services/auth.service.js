import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import jwt_utils from "../utils/jwt.js";
import users_validator from "./validators/users.validator.js";
import auth_validator from "./validators/auth.validator.js";

const add_user = async (userData) => {
  const {name, email, password, imageUrl} = userData;
  await users_validator.validate_user_input(userData);
  const newUser = new User({ name, email, password, imageUrl });
  newUser.createdBy = newUser._id;
  newUser.updatedBy = newUser._id;
  await newUser.save();
  return newUser;
};

const authenticate_user = async (email, password) => {
  email = email.toLowerCase();
  const user = await auth_validator.validate_login_input(email, password);
  const jwtid = crypto.randomUUID();
  const refresh_token = jwt_utils.generate_refresh_token(user, jwtid);
  const refresh_token_obj = new RefreshToken({
    user: user._id,
    jwtid: jwtid,
  });
  await refresh_token_obj.save();
  const access_token = jwt_utils.generate_access_token(user);
  return { refresh_token, access_token };
};

const refresh_token = async (token) => {
  const user = await auth_validator.validate_refresh_token(token);
  const access_token = jwt_utils.generate_access_token(user);
  return access_token;
};

const delete_token = async (token) => {
  const refresh_token = await auth_validator.validate_delete_token(token);
  return await refresh_token.deleteOne();
};

export default {
  add_user,
  authenticate_user,
  refresh_token,
  delete_token,
};
