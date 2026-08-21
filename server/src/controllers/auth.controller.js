import user_service from "../services/auth.service.js";

const register_user = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { errors, isValid } = await user_service.validate_user_input(
      name,
      email,
      password,
    );

    if (!isValid) {
        res.status(400).json({ message: "Invalid input", errors });
        return;
    } else {
      const newUser = await user_service.add_user(name, email, password);

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login_user = async (req, res) => {
  try {
  const { email, password } = req.body;
  const token = await user_service.authenticate_user(email, password);
  res.status(200).header("Authorization", `Bearer ${token}`).json({ message: "Login successful" });}
  catch (error) {
    res.status(401).json({ message: "Authentication failed", error: error.message });
} }

export default { register_user, login_user };
