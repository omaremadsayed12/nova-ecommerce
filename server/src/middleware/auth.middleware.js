import jwt_utils from "../utils/jwt.js";
import User from "../models/User.js";
import {
  AuthenticationError,
  AuthorizationError,
} from "../services/errors.service.js";

const verify_token = (role) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const details = {
        access_token: "No access token provided",
      };
      throw new AuthenticationError(details);
    }
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      const details = {
        access_token: "Invalid authorization header",
      };
      throw new AuthenticationError(details);
    }
    const decoded = jwt_utils.verify_token(token);
    const user = await User.findById(decoded.userId).select("+tokenVersion");
    if (!user) {
      const details = {
        user: "User not found",
      };
      throw new AuthenticationError(details);
    }
    if (Number(decoded.ver ?? 0) !== Number(user.tokenVersion ?? 0)) {
      throw new AuthenticationError({ access_token: "This access token has been revoked" });
    }
    if (role && user.role !== role) {
      const details = {
        user: "User doesn't have the required access",
      };
      throw new AuthorizationError(details);
    }
    req.user = user;
    next();
  };
};

export default { verify_token };
