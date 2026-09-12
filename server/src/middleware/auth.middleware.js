import jwt_utils from "../utils/jwt.js";
import User from "../models/User.js";
import { AuthenticationError, AuthorizationError } from "../services/errors.service.js";

const verify_token = (role) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const details = {
        access_token: "No access token provided",
      };
      throw new AuthenticationError(details);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      const details = {
        access_token: "No access token provided",
      };
      throw new AuthenticationError(details);
    }
    const decoded = jwt_utils.verify_token(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      const details = {
        user: "User not found",
      };
      throw new AuthenticationError(details);
    }
    if (role && user.role != role) {
      const details = {
        user: "User doesn't have the required access"
      }
      throw new AuthorizationError(details);
    }
    req.user = user;
    next();
  };
};

export default { verify_token };
