import jwt from "jsonwebtoken";
import { AuthenticationError } from "../services/errors.service.js";

const generate_refresh_token = (user, jwtid) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
      jwtid: jwtid,
    },
  );
};

const generate_access_token = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

const verify_token = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const details = {
        access_token: "The access token has expired",
      };
      throw new AuthenticationError(details);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      const details = {
        access_token: "Invalid access token",
      };
      throw new AuthenticationError(details);
    }
  }
};

const verify_refresh_token = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  return decoded;
};

export default {
  generate_refresh_token,
  generate_access_token,
  verify_token,
  verify_refresh_token,
};
