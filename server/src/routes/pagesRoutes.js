const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pagesController = require('../controllers/pagesController');

// Multer Storage Configuration for Image Uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, 'thiran-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Image Upload Endpoint
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file uploaded' });
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(200).json({
            success: true,
            imageUrl,
            filename: req.file.filename
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ success: false, error: 'Failed to process image upload' });
    }
});

// Single Event Detail Public API
router.get('/events/detail/:eventSlug', pagesController.getEventDetailBySlug);

// Page Settings & Complete Page Data
router.get('/:slug', pagesController.getPageBySlug);
router.put('/:slug/settings', pagesController.updatePageSettings);

// Sub-Events Routes
router.post('/:slug/events', pagesController.createSubEvent);
router.put('/:slug/events/reorder', pagesController.reorderSubEvents);
router.put('/:slug/events/:eventId', pagesController.updateSubEvent);
router.delete('/:slug/events/:eventId', pagesController.deleteSubEvent);

// Content Sections Routes
router.post('/:slug/sections', pagesController.createContentSection);
router.put('/:slug/sections/reorder', pagesController.reorderContentSections);
router.put('/:slug/sections/:sectionId', pagesController.updateContentSection);
router.delete('/:slug/sections/:sectionId', pagesController.deleteContentSection);

module.exports = router;
