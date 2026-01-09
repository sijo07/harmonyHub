const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

// Filter only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Public (or Private)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the path relative to server root
        // In local dev we can return full URL if we knew hostname, 
        // but returning relative path which frontend can prefix is standard.
        // Or we can return absolute path if using static serve.
        const filePath = `/uploads/${req.file.filename}`;

        res.json({
            message: 'Image uploaded',
            imageUrl: filePath
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
