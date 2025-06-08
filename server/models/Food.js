
const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String },
    ingredients: [{
       
        itemName: { type: String, required: true },
        quantity: { 
            value: { type: Number, required: true, min: 1 },
            unit: { type: String, required: true },
        }
    }],
});

module.exports = mongoose.model('Meal', MealSchema);
