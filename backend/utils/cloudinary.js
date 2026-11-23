import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadToCloudinary = (bufferOrPath, folder = "payment_qrcodes") => {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(bufferOrPath)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(bufferOrPath);
    } else {
      cloudinary.uploader.upload(
        bufferOrPath,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    }
  });
};

export { cloudinary };
