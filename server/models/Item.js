const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
   imageUrl: { type: String }, 
  quantity: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Item', ItemSchema);
