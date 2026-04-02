import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// ---

// **PR Description** — copy this directly:
// ```
// ## Backend File Upload Endpoint

// ### Changes Made
// - ✅ Installed multer and cloudinary packages
// - ✅ Created server/config/cloudinary.js with SDK configuration
// - ✅ Created server/middleware/upload.js with memory storage
// - ✅ Added 5MB file size limit
// - ✅ Added image-only file type filter
// - ✅ Created server/routes/upload.js
// - ✅ Implemented uploadToCloudinary with upload_stream
// - ✅ POST /api/upload protected by authMiddleware
// - ✅ Returns secure_url and publicId on success
// - ✅ Added Multer error handler (4-parameter middleware)
// - ✅ Registered route in server.js

// ### How It Works
// Files are sent as multipart/form-data. Multer parses the request and holds
// the file in memory as a Buffer (never written to disk). The buffer is piped
// into Cloudinary's upload_stream via a Promise wrapper, which lets us use
// async/await. On success, the route returns the secure_url and public_id.
// Auth is enforced by authMiddleware before any file processing begins.

// ### Testing Verified
// - ✅ Successful upload returns Cloudinary URL
// - ✅ Image visible in Cloudinary Media Library
// - ✅ Rejects requests without a valid token (401)
// - ✅ Rejects non-image files (400)
// - ✅ Rejects files over 5MB (400)

// ### Video Demo
// [Link to video]