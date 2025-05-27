
const path = require('path'); 

exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'לא נבחר קובץ תמונה.' });
  }
     const imageUrl = `/uploads/${req.file.filename}`; 
  
  res.status(200).json({ message: 'התמונה הועלתה בהצלחה!', imageUrl: imageUrl });
};