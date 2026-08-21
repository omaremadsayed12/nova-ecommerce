import cloudinary from "../utils/cloudinary.js";

const uploadImage = async (req, res, next) => {
    const imageFile = req.files?.image;
    if (!imageFile) {
        req.body.imageUrl = null; 
        next();
    }
    else {
        const result = await cloudinary.uploadImage(imageFile.tempFilePath);
        req.body.imageUrl = result.secure_url;
        next(); 
    }
}

export default {uploadImage};