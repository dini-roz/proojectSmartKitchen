const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
   imageUrl: { type: String }, 
  quantity: { type: Number, default: 0 } 
});

module.exports = mongoose.model('Item', ItemSchema);
// const mongoose = require('mongoose');

// const ItemSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     imageUrl: { type: String }, 
//     quantity: { // שינינו את quantity לאובייקט שיכיל את הכמות והיחידה
//         value: { type: Number, required: true, default: 0 }, // 'value' עבור הכמות המספרית
//         unit: { type: String, required: true, default: 'גרם' } // 'unit' עבור יחידת המידה
//     } 
// });

// module.exports = mongoose.model('Item', ItemSchema);
// const mongoose = require('mongoose');

// const ItemSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     imageUrl: { type: String }, 
//     quantity: { // שינינו את quantity לאובייקט שיכיל את הכמות והיחידה
//         value: { type: Number, required: true, default: 0 }, // 'value' עבור הכמות המספרית
//         unit: { type: String, required: true, default: 'גרם' } // 'unit' עבור יחידת המידה
//     } 
// });

// module.exports = mongoose.model('Item', ItemSchema);