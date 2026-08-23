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

const add_user = async (req,res) => {
  try {
    const {name, email, password, role} = req.body;
    const {error, isValid} = await users_service.validate_user_input(name, email, password, role);
    if(!isValid){
      res.status(400).json({ message: "Invalid input", errors });
    }
    else{
      const newUser = await users_service.add_user(name, email, password, role)
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default { get_all_users, add_user };
