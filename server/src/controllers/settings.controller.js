import settings_service from "../services/settings.service.js";

const get_settings = async (req, res) => {
  const settings = await settings_service.get_settings();
  res.status(200).json({
    success: true,
    message: "Settings fetched successfully",
    data: settings,
    error: null,
    meta: null,
  });
};

const update_settings = async (req, res) => {
  const user = req.user;
  const body = req.body;
  const settings = await settings_service.update_settings(user, body);
  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: settings,
    error: null,
    meta: null
  });
};

export default { get_settings, update_settings };
