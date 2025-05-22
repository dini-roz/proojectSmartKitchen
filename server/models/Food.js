const mongoose = require('mongoose')
const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity:{
            count: String,
            unit: String,
        }
    }],
 
});

module.exports = mongoose.model('Meal', MealSchema);
