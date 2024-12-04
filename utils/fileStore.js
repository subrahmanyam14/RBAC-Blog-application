const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storeFile = (fieldName) => {
  // Check if 'uploads' directory exists; if not, create it
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // Configure Multer storage with original filename and extension
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname); // Extract the file extension
      cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Generate unique filename
    },
  });

  // Create Multer instance
  const upload = multer({ storage });

  // Return the appropriate middleware for the specified field
  return upload.single(fieldName);
};

module.exports = { storeFile };
