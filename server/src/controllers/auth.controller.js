import auth_service from "../services/auth.service.js";

const register_user = async (req, res) => {
  try {
    const { name, email, password, imageUrl } = req.body;

    const { errors, isValid } = await auth_service.validate_user_input(
      name,
      email,
      password,
      imageUrl,
    );

    if (!isValid) {
      res.status(400).json({ message: "Invalid input", errors });
      return;
    } else {
      const newUser = await auth_service.add_user(
        name,
        email,
        password,
        imageUrl,
      );
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
    const { refresh_token, access_token } =
      await auth_service.authenticate_user(email, password);
    res
      .status(200)
      .json({ message: "Login successfully", refresh_token, access_token });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

const refresh_token = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      res.status(400).json({ message: "Refresh token not found in cookies" });
    } else {
      const access_token = await auth_service.refresh_token(token);
      res.status(200).json({ access_token });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout_user = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    const deleted = await auth_service.delete_token(token);
    if (deleted) {
      res.status(200).json({ message: "User logged out successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const get_current_user = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  register_user,
  login_user,
  refresh_token,
  get_current_user,
  logout_user
};
