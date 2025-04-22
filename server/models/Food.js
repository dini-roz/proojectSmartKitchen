const mongoose = require('mongoose')
const MealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredients: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity:{

        
            count: Number,
         
            unit: {
                type: String,
                enum: ['grams', 'cups','spoon','4','5'],
                default: "1",
            },
            

        }
    }],
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Meal', MealSchema);
