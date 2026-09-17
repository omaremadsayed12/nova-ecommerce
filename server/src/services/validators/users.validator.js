import mongoose from "mongoose";
import User from "../../models/User.js";
import { NotFoundError, ValidationError } from "../errors.service.js";

const validate_user_input = async (user_data) => {
  const { name, email, password, role } = user_data;
  const englishName = name.en;
  const arabicName = name.ar;
  if (!englishName || englishName.length < 2 || englishName.length > 50) {
    const details = {
      name: "English name must be between 2 and 50 characters",
    };
    throw new ValidationError(details);
  } 
  if (arabicName && (arabicName.length < 2 || arabicName.length > 50)) {
    const details = {
      name: "Arabic name must be between 2 and 50 characters",
    };
    throw new ValidationError(details);
  } 
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    const details = {
      email: "Invalid email format",
    };
    throw new ValidationError(details);
  } else {
    const normalizedEmail = email.toLowerCase();
    await User.findOne({ email: normalizedEmail }).then((user) => {
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

  if (role && !["ADMIN", "CUSTOMER"].includes(role)) {
    const details = {
      role: "Role must be Admin or Customer",
    };
    throw new ValidationError(details);
  }
};

const validate_user_update_input = async (user_data, user_id) => {
  const { name, email, password, role } = user_data;
  const errors = [];
  let isValid = true;
  if (name && (name.length < 2 || name.length > 50)) {
    const details = {
      name: "Name must be between 2 and 50 characters",
    };
    throw new ValidationError(details);
  }

  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    const details = {
      email: "Invalid email format",
    };
    throw new ValidationError(details);
  } else {
    if (email) {
      const normalizedEmail = email.toLowerCase();
      User.findOne({ email: normalizedEmail }).then((user) => {
        if (user._id != user_id) {
          const details = {
            email: "${email} this email is used by other user",
          };
          throw new ValidationError(details);
        }
      });
    }
  }

  if (password && password.length < 8) {
    const details = {
      password: "Password must be at least 8 characters long",
    };
    throw new ValidationError(details);
  }

  if (role && !["ADMIN", "CUSTOMER"].includes(role)) {
    const details = {
      role: "Role must be Admin or Customer",
    };
    throw new ValidationError(details);
  }
};

const validate_user = async (user_id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(user_id);
  if (!isValidId) {
    const details = {
      user: `${user_id} is not a valid user id`,
    };
    throw new ValidationError(details);
  } else {
    const user = await User.findById(user_id);
    if (!user) {
      const details = {
        user: "User not found",
      };
      throw new NotFoundError(details);
    } else {
      return user;
    }
  }
};

export default {
  validate_user_input,
  validate_user_update_input,
  validate_user,
};
