
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
    //      {
    //   itemId: { // עבור שגיאת ה-Populate
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Item', // שם המודל של המוצרים הכלליים
    //     required: true 
    //   },
    //   name: { type: String, required: true },
    //   quantity: { // זה חייב להיות אובייקט משובץ
    //     value: { type: Number, required: true }, // ולידציה על value
    //     unit: { type: String, required: true }   // ולידציה על unit
    //   },
    //   imageUrl: { type: String },
    //   category: { type: String, required: true },
    // }
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
            name: { type: String, required: true }, // Store name for easy access/display
            imageUrl: { type: String }, // Store image URL for easy access/display
            // You might want to store more details here if needed, or just rely on populate
    
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