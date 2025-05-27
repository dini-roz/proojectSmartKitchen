
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,

    },
    password:
    {
        type: String,
        required: true,
        minlength: 8
    },
    paymentDetails: {
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
        CVV: { type: String, required: true }
    },
    email: {
        type: String,
        required: true,
        trim: true

    },
    phone: {
        type: String,
    },
    kitchenItems: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: Number,
        name: String
    }],
    shoppingList: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },

    }],
    food: [{
        mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }
    }]
});

module.exports = mongoose.model('UserSchema', UserSchema);



