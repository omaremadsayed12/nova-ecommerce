import jwt_utils from "../utils/jwt.js";
import User from "../models/User.js";

const verify_token = (role) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          message: "No access token provided",
        });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          message: "No access token provided",
        });
      }
      const decoded = jwt_utils.verify_token(token);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      if (role && user.role != role) {
        return res.status(403).json({ message: "Access denied" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Authentication failed", error: error.message });
    }
  };
};

export default { verify_token };
