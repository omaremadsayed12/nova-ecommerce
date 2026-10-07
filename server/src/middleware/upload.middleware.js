import { readFile } from "node:fs/promises";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";

const matches_allowed_image = (buffer, mimeType) => {
    if (mimeType === "image/jpeg") {
        return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }
    if (mimeType === "image/png") {
        return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    }
    if (mimeType === "image/webp") {
        return buffer.toString("ascii", 0, 4) === "RIFF" &&
            buffer.toString("ascii", 8, 12) === "WEBP";
    }
    if (mimeType === "image/avif") {
        if (buffer.toString("ascii", 4, 8) !== "ftyp") return false;
        for (let offset = 8; offset + 4 <= Math.min(buffer.length, 128); offset += 4) {
            const brand = buffer.toString("ascii", offset, offset + 4);
            if (brand === "avif" || brand === "avis") return true;
        }
    }
    return false;
};

const upload_image = async (req, res, next) => {
    req.body = req.body || {};
    const imageFile = req.files?.image;
    if (!imageFile) {
        if (Object.hasOwn(req.body, "imageUrl")) {
            throw new AppError("Upload an image file instead of providing an image URL", 400, "INVALID_IMAGE");
        }
        return next();
    }
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
    if (Array.isArray(imageFile) || !allowedTypes.has(imageFile.mimetype) || imageFile.size > 5 * 1024 * 1024 || imageFile.truncated) {
        throw new AppError("Upload one image no larger than 5 MB", 400, "INVALID_IMAGE");
    }
    const imageBuffer = await readFile(imageFile.tempFilePath);
    if (!matches_allowed_image(imageBuffer, imageFile.mimetype)) {
        throw new AppError("Upload a valid JPEG, PNG, WebP, or AVIF image", 400, "INVALID_IMAGE");
    }
    const result = await cloudinary.uploadImage(imageFile.tempFilePath);
    req.body.imageUrl = result.secure_url;
    return next();
}

export default {upload_image};