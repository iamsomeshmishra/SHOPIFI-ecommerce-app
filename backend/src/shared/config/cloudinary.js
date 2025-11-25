import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary only if credentials exist
const isConfigured = (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME) && 
                    process.env.CLOUDINARY_API_KEY && 
                    process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export const uploadToCloudinary = async (fileBuffer, folder = 'cinematic_shop') => {
  if (!isConfigured) {
    console.warn('Cloudinary not configured. Returning local placeholder fallback.');
    // Return a beautiful dynamic placeholder for mock purposes
    return {
      secure_url: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80`
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

export default cloudinary;
