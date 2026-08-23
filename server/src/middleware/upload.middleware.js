import cloudinary from "../utils/cloudinary.js";

const upload_image = async (req, res, next) => {
    const imageFile = req.files?.image;
    if (!imageFile) {
        req.body.imageUrl = null; 
        next();
    }
    else {
        const result = await cloudinary.uploadImage(imageFile.tempFilePath);
        req.body = req.body || {};
        req.body.imageUrl = result.secure_url;
        next(); 
    }
}

export default {upload_image};