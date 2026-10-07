import { v2 as cloudinary } from "cloudinary";

cloudinary.config();

const uploadImage = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "imgs",
      use_filename: true,
    });
    return result;
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw error;
  }
};

export default { uploadImage };
