import { v2 as cloudinary } from "cloudinary";

try {
  cloudinary.config({
    cloud_url: process.env.CLOUDINARY_URL
  });
} catch (error) {
  console.error("Cloudinary configuration error:", error.message);
}

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
