require("dotenv").config();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const apiSecret = process.env.CLOUD_API_SECRET;

if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !apiSecret) {
  console.error("Cloudinary config is incomplete. Check CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET.");
}


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: apiSecret
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "image") {
      return {
        folder: "FindoraItems/Images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image"
      };
    }}});


const upload = multer({ storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    } });
module.exports = {upload};