const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name : process.env.KEY_NAME,
  api_key : process.env.API_KEY,
  api_secret : process.env.API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "wanderlus_dev",
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    };
  },
});


module.exports = { cloudinary,  storage };