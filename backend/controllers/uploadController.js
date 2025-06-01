const multer = require('multer');
const fs = require('fs');
const path = require('path');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

exports.uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }
    res.json({
      imageUrl: `${BASE_URL}/uploads/${req.file.filename}`
    });
  });
};