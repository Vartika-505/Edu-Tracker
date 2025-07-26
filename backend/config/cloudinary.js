import express from 'express';
import multer from 'multer';
import cloudinary from 'cloudinary';
import User from '../models/User.js'; 
const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export { cloudinary, upload };