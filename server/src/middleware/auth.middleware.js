import jwt_utils from "../utils/jwt.js";
import User from "../models/User.js";

const verify_token = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt_utils.verify_token(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const is_admin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt_utils.verify_token(token);
  if (decoded.role === "ADMIN") {
    next(); 
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};

export default { verify_token, is_admin };