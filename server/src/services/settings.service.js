import StoreSettings from "../models/StoreSettings";

const get_settings = async () => {
  return await StoreSettings.findOne();
};

const update_settings = async (user, body) => {
  const updateData = Object.fromEntries(
    Object.entries(body).filter(([_, value]) => value !== null),
  );
  return await StoreSettings.findOneAndUpdate(
    {},
    {...updateData, updatedBy: user._id, updatedAt: Date.now()},
    {returnDocument:"after"}
  );
};

export default { get_settings, update_settings };
