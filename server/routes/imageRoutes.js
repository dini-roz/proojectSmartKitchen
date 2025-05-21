// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); // ייבוא אובייקט ה-upload שהגדרת

// ייבוא פונקציית הקונטרולר שתטפל בלוגיקה (נניח שזה בקובץ imageController.js)
const imageController = require('../controllers/imageController'); 

// נקודת קצה להעלאת תמונה
// upload.single('image') הוא ה-middleware של multer
// הוא יטפל בקובץ לפני שהבקשה מגיעה לקונטרולר
router.post('/upload-image', upload.single('image'), imageController.uploadImage);

module.exports = router;