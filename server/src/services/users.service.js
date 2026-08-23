import Users from '../models/User.js';

const get_all_users = async () => {
    return await Users.find();
}

const validate_user_input = async (name, email, password, role) => {
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

  if (!role || role != "ADMIN" || role != "CUSTOMER") {
    errors.push("Role must be Admin or Customer");
    isValid = false;
  }

  return { errors, isValid };
};

const add_user = async (name, email, password, role) => {
  const newUser = new User({ name, email, password, role });
  await newUser.save();
  return newUser;
};


export default {get_all_users, validate_user_input, add_user};