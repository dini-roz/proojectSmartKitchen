
const UserSchema = require('../models/User'); 
const Item = require('../models/Item'); 


exports. addItemToUser = async (req, res) => {
  const { userId } = req.params;
  const { name, quantity, imageUrl, category } = req.body;
  try {
     const user = await UserSchema.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    const existingItemInKitchen =user.kitchenItems.find(item=>item.name===name)
    if(existingItemInKitchen){
      existingItemInKitchen.quantity+=quantity
     
await user.save()
  try {
                const itemToUpdate = await Item.findById(existingItemInKitchen.itemId);
                if (itemToUpdate) {
                    itemToUpdate.quantity = existingItemInKitchen.quantity;
                    await itemToUpdate.save();
                    console.log(`כמות הפריט ${itemToUpdate.name} עודכנה גם במסמך Item.`);
                } else {
                    console.log(`לא נמצא פריט עם ID: ${existingItemInKitchen.itemId}`);
                }
            } catch (error) {
                console.error('שגיאה בעדכון כמות הפריט במסמך Item:', error);
            }
        return res.status(200).json({
                message: ' ולכן  כמות המוצר במטבח עודכנה בהצלחה!  המוצר כבר קים!',
                userKitchenItem: existingItemInKitchen
            });
    }
    else{
const newItem = new Item({
      name,
      quantity: quantity || 1, 
      imageUrl,
      category,  
    });
   const savedItem = await newItem.save();
     user.kitchenItems.push({ itemId: savedItem._id, name: savedItem.name, quantity: savedItem.quantity,
     });
     await user.save();
   // res.status(201).json(savedItem ,user.username); 
    res.status(201).json({
      message: 'המוצר נוסף בהצלחה למטבח!',
      item: savedItem, 
      userKitchenItem: { 
        itemId: savedItem._id,
        name: savedItem.name,
        quantity: savedItem.quantity
      }
    });
    }
   
  } catch (error) {
    console.error('שגיאה בהוספת מוצר למשתמש:', error);
    res.status(500).json({ message: 'שגיאה בהוספת מוצר' });
  }  
};
exports.getProducts = async (req, res) => {
    const { userId } = req.params;
  try {
      const user = await UserSchema.findOne({ username: userId }).populate('kitchenItems.itemId');
     if (!user) {
      return res.status(404).json({ message: 'משתמש לא קים' });
    }
    const products = user.kitchenItems.map(kitchenItem => ({
      _id: kitchenItem.itemId._id, 
      name: kitchenItem.itemId.name, 
      quantity: kitchenItem.quantity, 
      imageUrl: kitchenItem.itemId.imageUrl, 
      category: kitchenItem.itemId.category, 
    }));
       res.status(200).json(products,{ message: 'המוצר נשלף בהצלחה' });
  } catch (error) {
   
    console.error('שגיאה בטעינת מוצר:', error);
    res.status(500).json({ message: 'שגיאה בטעינת מוצר' });
  }
};