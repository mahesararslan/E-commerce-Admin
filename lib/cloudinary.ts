import { v2 as cloudinary } from 'cloudinary';  
import fs from 'fs';

// @ts-ignore
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath: any) => {
  try {
    if(!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    console.log("Image uploaded to Cloudinary: ", result.url);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation failed.
    console.error("Error uploading image to Cloudinary: ", error);
  }
}

export default uploadOnCloudinary;
