const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig'); 
const imageController = require('../controllers/imageController'); 
router.post('/upload-image', upload.single('image'), imageController.uploadImage);

module.exports = router;