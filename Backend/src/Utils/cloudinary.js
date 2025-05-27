import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file uploaded

    console.log("File Uploaded on cloud", res.url);
    return res;
  } catch (err) {
    fs.unlinkSync(localFilePath) // Remove local file 
    return null;
  }
};

 
export {uploadOnCloudinary}