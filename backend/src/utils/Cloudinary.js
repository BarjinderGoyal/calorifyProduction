// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// cloudinary.config({
//   cloud_name: `${process.env.CLOUDINARY_NAME}`,
//   api_key: `${process.env.CLOUDINARY_API_KEY}`,
//   api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Click 'View Credentials' below to copy your API secret
// });

// const uploadOnCloudinary = async (localFileUri) => {
//   try {
//     if (!localFileUri) return null;
//     const response = await cloudinary.uploader.upload(localFileUri, {
//       resource_type: "auto",
//     });
//     if (response) {
//       console.log("cloudinary url is", response?.url);
//       return response?.url;
//     } else {
//       return null;
//     }
//   } catch (e) {
//     fs.unlinkSync(localFileUri);
//   }
// };

// export { uploadOnCloudinary };

import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_API_KEY);

const uploadOnCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result.url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export { uploadOnCloudinary };
