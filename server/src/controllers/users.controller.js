import users_service from "../services/users.service.js";

const get_all_users = async (req, res) => {
  const users = await users_service.get_all_users();
  res.status(200).json({
    success: true,
    message: "Retrieved all users successfully",
    data: users,
    error: null,
    meta: null,
  });
};

const add_user = async (req, res) => {
  const body = req.body;
  const creator = req.user;
  const user = await users_service.add_user(body, creator);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
    error: null,
    meta: null,
  });
};

const update_user = async (req, res) => {
  const user_id = req.params.id;
  const updater = req.user;
  const user_data = req.body;
  const user = await users_service.update_user(user_id, user_data, updater);
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
    error: null,
    meta: null,
  });
};

const delete_user = async (req, res) => {
    const user_id = req.params.id;
    const deleter = req.user;
    const user = await users_service.delete_user(user_id, deleter);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
      error: null,
      meta: null
    });
};

export default { get_all_users, add_user, update_user, delete_user };
