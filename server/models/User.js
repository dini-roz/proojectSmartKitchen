
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
      profilePicture  : String,
    kitchenItems: [
   
    {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        quantity: Number,
        name: String
    }
    ],
    shoppingList: [{
      name:String,
      quantity :String

    }],
    food: [{
        // mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }
         
          mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
            name: { type: String, required: true },
            imageUrl: { type: String },
          
    
    }]
});

module.exports = mongoose.model('UserSchema', UserSchema);



// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true,
//         trim: true
//     },
//     name: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8
//     },
//     paymentDetails: {
//         cardNumber: { type: String, required: true },
//         expiryDate: { type: String, required: true },
//         CVV: { type: String, required: true }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     phone: {
//         type: String,
//     },
//     profilePicture: String,
//     kitchenItems: [ // זהו מערך של אובייקטים
//         {
//             itemId: { 
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Item', // מפנה למודל 'Item'
//                 required: true 
//             },
//             name: { type: String, required: true },
//             quantity: { // אובייקט משובץ לכמות ויחידה
//                 value: { type: Number, required: true },
//                 unit: { type: String, required: true }
//             },
//             imageUrl: { type: String },
//             category: { type: String, required: true },
//         }
//     ],
//     shoppingList: [{
//         name: String,
//         quantity: String
//     }],
//     food: [{
//         mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' }
//     }]
// });

// // שינוי קריטי: ייצוא המודל בשם 'User'
// module.exports = mongoose.model('User', UserSchema);