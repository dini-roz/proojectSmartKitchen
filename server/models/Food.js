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
// const Qty = require('js-quantities');
// const Item = require('../models/item');
// const Meal = require('../models/meal');

// // הגדרת המרות יחידות (יש להוסיף את כל ההמרות הרלוונטיות)
// Qty.conversion('bottle', 'cup', 4);
// Qty.conversion('cup', 'tablespoon', 16);
// Qty.conversion('tablespoon', 'teaspoon', 3);
// Qty.conversion('gram', 'kilogram', 0.001);
// // ... הוסף המרות נוספות לפי הצורך

// async function canUserMakeMeal(userId, mealId) {
//     try {
//         const userItems = await Item.find({ /* תנאי שיביא את הפריטים של המשתמש הספציפי */ });
//         const userInventory = {};
//         userItems.forEach(item => {
//             if (item.unit) {
//                 userInventory[item.name] = new Qty(`${item.quantity} ${item.unit}`);
//             }
//         });

//         const meal = await Meal.findById(mealId).populate('ingredients.itemId');
//         if (!meal) {
//             return { canMake: false, message: 'המתכון לא נמצא.' };
//         }

//         for (const ingredient of meal.ingredients) {
//             const itemName = ingredient.itemId.name;
//             const requiredQtyValue = ingredient.quantity.count;
//             const requiredQtyUnit = ingredient.quantity.unit;
//             const requiredQty = new Qty(`${requiredQtyValue} ${requiredQtyUnit}`);

//             if (!userInventory[itemName]) {
//                 return { canMake: false, missing: itemName };
//             }

//             try {
//                 const availableQty = userInventory[itemName];
//                 if (availableQty.to(requiredQty.units()).lt(requiredQty)) {
//                     return { canMake: false, missing: itemName, needed: requiredQty.toString(), available: availableQty.toString() };
//                 }
//             } catch (error) {
//                 console.error(`שגיאה בהשוואת יחידות עבור ${itemName}: ${error.message}`);
//                 return { canMake: false, error: `לא ניתן להשוות כמויות עבור ${itemName}.` };
//             }
//         }

//         return { canMake: true };

//     } catch (error) {
//         console.error("שגיאה בבדיקת אפשרות הכנת המתכון:", error);
//         return { canMake: false, error: 'אירעה שגיאה בעת הבדיקה.' };
//     }
// }

// async function updateUserInventoryAfterCooking(userId, mealId) {
//     try {
//         const meal = await Meal.findById(mealId).populate('ingredients.itemId');
//         if (!meal) {
//             return { success: false, message: 'המתכון לא נמצא.' };
//         }

//         const userItems = await Item.find({ /* תנאי שיביא את הפריטים של המשתמש הספציפי */ });
//         const userInventoryMap = new Map();
//         userItems.forEach(item => {
//             userInventoryMap.set(item.name, item);
//         });

//         for (const ingredient of meal.ingredients) {
//             const itemName = ingredient.itemId.name;
//             const usedQtyValue = ingredient.quantity.count;
//             const usedQtyUnit = ingredient.quantity.unit;
//             const usedQty = new Qty(`${usedQtyValue} ${usedQtyUnit}`);

//             const inventoryItem = userInventoryMap.get(itemName);
//             if (inventoryItem && inventoryItem.unit) {
//                 const availableQty = new Qty(`${inventoryItem.quantity} ${inventoryItem.unit}`);
//                 try {
//                     const remainingQty = availableQty.minus(usedQty.to(availableQty.units()));
//                     await Item.updateOne(
//                         { _id: inventoryItem._id },
//                         { $set: { quantity: remainingQty.scalar } }
//                     );
//                 } catch (error) {
//                     console.error(`שגיאה בעדכון הכמות עבור ${itemName}: ${error.message}`);
//                     return { success: false, error: `לא ניתן לעדכן את הכמות עבור ${itemName}.` };
//                 }
//             } else {
//                 console.warn(`לא נמצא פריט '${itemName}' במלאי המשתמש או שיחידת המידה שלו לא מוגדרת.`);
//             }
//         }

//         return { success: true, message: 'מלאי המשתמש עודכן בהצלחה.' };

//     } catch (error) {
//         console.error("שגיאה בעדכון מלאי המשתמש:", error);
//         return { success: false, error: 'אירעה שגיאה בעת עדכון המלאי.' };
//     }
// }

// module.exports = { canUserMakeMeal, updateUserInventoryAfterCooking };
////////////////////////////////////////////////////////////
