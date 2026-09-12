import auth_service from "../services/auth.service.js";
import { AuthenticationError } from "../services/errors.service.js";

const register_user = async (req, res) => {
  const { name, email, password, imageUrl } = req.body;

  const user = await auth_service.add_user(name, email, password, imageUrl);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
    error: null,
    meta: null,
  });
};

const login_user = async (req, res) => {
  const { email, password } = req.body;
  const { refresh_token, access_token } = await auth_service.authenticate_user(
    email,
    password,
  );
  res
    .cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Authentication success",
      data: {
        access_token: access_token,
      },
      error: null,
      meta: null,
    });
};

const refresh_token = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    const detials = {
      refresh_token: "No token found in browser cookies",
    };
    throw new AuthenticationError(detials);
  } else {
    const access_token = await auth_service.refresh_token(token);
    res.status(200).json({
      success: true,
      message: "New access token generated successfully",
      data: {
        access_token,
      },
      error: null,
      meta: null,
    });
  }
};

const logout_user = async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    const detials = {
      refresh_token: "No token found in browser cookies",
    };
    throw new AuthenticationError(detials);
  } else {
    await auth_service.delete_token(token);
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
      data: null,
      error: null,
      meta: null,
    });
  }
};

const get_current_user = (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Current User detials fetched successfully",
    data: user,
    error: null,
    meta: null,
  });
};

export default {
  register_user,
  login_user,
  refresh_token,
  get_current_user,
  logout_user,
};
