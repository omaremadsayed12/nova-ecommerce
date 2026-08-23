import jwt_utils from "../utils/jwt.js";
import User from "../models/User.js";

const verify_token = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt_utils.verify_token(token);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      if (role && user.role != role) {
        return res.status(403).json({  message: "Access denied" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
};

export default {verify_token};
