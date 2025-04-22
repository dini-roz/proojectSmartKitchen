
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    paymentDetails: {
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, required: true }, 
        CVV: { type: String, required: true }
    },
    email:{type:String,required:true},
    kitchenItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: Number,
        category: String
    }],
    shoppingList: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      
        purchaseDay: {
            type: String,
            enum: ['1', '2','3','4','5'],
            default: "1",
        },
    }],
    food: [{
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }
    }]
});

module.exports = mongoose.model('UserSchema', UserSchema);



