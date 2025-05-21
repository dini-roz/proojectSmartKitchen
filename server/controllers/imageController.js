
const path = require('path'); 

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'לא נבחר קובץ תמונה.' });
  }

  // req.file מכיל את המידע על הקובץ שהועלה לאחר ש-multer טיפל בו
  // ה-URL היחסי של התמונה, בהנחה שהשרת מגיש קבצים סטטיים מתיקיית 'uploads'
  const imageUrl = `/uploads/${req.file.filename}`; 
  
  res.status(200).json({ message: 'התמונה הועלתה בהצלחה!', imageUrl: imageUrl });
};