import User from "../../models/User.js";
import RefreshToken from "../../models/RefreshToken.js";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "../errors.service.js";

const validate_register_input = async (name, email, password) => {
  if (!name || name.length < 2 || name.length > 50) {
    const details = {
      name: "Name must be between 2 and 50 characters",
    };
    throw new ValidationError(details);
  }
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    const details = {
      email: "Invalid email format",
    };
    throw new ValidationError(details);
  } else {
    email = email.toLowerCase();
    User.findOne({ email }).then((user) => {
      if (user) {
        const details = {
          email: "Email already exists",
        };
        throw new ValidationError(details);
      }
    });
  }

  if (!password || password.length < 8) {
    const details = {
      password: "Password must be at least 8 characters long",
    };
    throw new ValidationError(details);
  }
};

const validate_login_input = async (email, password) => {
  if (!password || password.length < 8) {
    const details = {
      password: "Password must be at least 8 characters long",
    };
    throw new ValidationError(details);
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    const details = {
      email: "Invalid email format",
    };
    throw new ValidationError(details);
  } else {
    email = email.toLowerCase();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const details = {
        email: "User not found",
      };
      throw new NotFoundError(details);
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        const details = {
          password: "Password mismatch",
        };
        throw new ValidationError(details);
      } else {
        return user;
      }
    }
  }
};

const validate_refresh_token = async (token) => {
  const decoded = jwt_utils.verify_refresh_token(token);
  if (!decoded) {
    const details = {
      refresh_token: "Failed to verify refresh token",
    };
    throw new ValidationError(details);
  } else {
    const refresh_token = await RefreshToken.findOne({ jwtid: decoded.jti });
    if (!refresh_token) {
      const details = {
        refresh_token: "Invalid refresh token",
      };
      throw new NotFoundError(details);
    } else {
      details.refresh_token = refresh_token;
      const user = await User.findById(decoded.userId);
      if (!user) {
        const details = {
          user: "User not found",
        };
        throw new NotFoundError(details);
      } else {
        return user;
      }
    }
  }
};

const validate_delete_token = async (token) => {
  const decoded = jwt_utils.verify_refresh_token(token);
  if (!decoded) {
    const details = {
      refresh_token: "Failed to verify refresh token",
    };
    throw new ValidationError(details);
  } else {
    const refresh_token = await RefreshToken.findOne({ jwtid: decoded.jti });
    if (!refresh_token) {
      const details = {
        refresh_token: "Invalid refresh token",
      };
      throw new NotFoundError(details);
    } else {
      return refresh_token;
    }
  }
};

const owner_or_admin = (user, obj) => {
  if (user.role != "ADMIN" && obj.user != user._id) {
    const details = {
      user: "User doesn't have the required access",
    };
    throw new AuthorizationError(details);
  }
};

export default {
  validate_register_input,
  validate_login_input,
  validate_refresh_token,
  validate_delete_token,
  owner_or_admin,
};
