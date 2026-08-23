import users_service from "../services/users.service.js";

const get_all_users = async (req, res) => {
  try {
    const users = await users_service.get_all_users();
    res
      .status(200)
      .json({ message: "Retrieved all users successfully", data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const add_user = async (req, res) => {
  try {
    const body = req.body;
    const creator = req.user;
    const { errors, isValid } = await users_service.validate_user_input(
      body
    );
    if (!isValid) {
      res.status(400).json({ message: "Invalid input", error: errors });
    } else {
      const newUser = await users_service.add_user(
        body, creator
      );
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const update_user = async (req, res) => {
  try {
    const user_id = req.params.id;
    const updater = req.user;
    const found = await users_service.check_user(user_id);
    if (!found) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user_data = req.body;
    const { errors, isValid } =
      await users_service.validate_user_update_input(user_data);
    if (!isValid) {
      res.status(400).json({ message: "Invalid input", error: errors });
    } else {
      const newUser = await users_service.update_user(user_id, user_data, updater);
      res
        .status(201)
        .json({ message: "User added successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const delete_user = async (req, res) => {
  try {
    const user_id = req.params.id;
    const found = users_service.check_user(user_id);
    if (!found) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const deleted = users_service.delete_user(user_id);
    if (deleted) {
      res.status(204).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default { get_all_users, add_user, update_user, delete_user };
