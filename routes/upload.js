import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper: wraps Cloudinary's upload_stream in a Promise
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'creator-platform' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Multer error handler — must have exactly 4 parameters
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.'
    });
  }

  return res.status(400).json({
    success: false,
    message: error.message || 'File upload error'
  });
});

export default router;