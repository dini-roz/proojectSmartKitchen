const multer = require('multer');
const path = require('path');

// הגדרת Multer לאחסון קבצים
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // נתיב לתיקיית uploads בתוך הפרויקט הנוכחי
    // ודא שהתיקייה הזו קיימת!
    cb(null, path.join(__dirname, '../uploads')); // נתיב יחסי מהקובץ הזה
  },
  filename: function (req, file, cb) {
    // יצירת שם קובץ ייחודי כדי למנוע התנגשויות
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;