
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
   const newItem = new Item({
      name,
      quantity: quantity || 1, 
      imageUrl,
      category,
      
    });
   const savedItem = await newItem.save();
     user.kitchenItems.push({ itemId: savedItem._id, quantity: savedItem.quantity,
      category: savedItem.category,});
     await user.save();
   // res.status(201).json(savedItem ,user.username); 
    res.status(201).json({
      message: 'המוצר נוסף בהצלחה למטבח!',
      item: savedItem, 
      userKitchenItem: { 
        itemId: savedItem._id,
        quantity: savedItem.quantity,
        category: savedItem.category
      }
    });
  } catch (error) {
    console.error('שגיאה בהוספת מוצר למשתמש:', error);
    res.status(500).json({ message: 'שגיאה בהוספת מוצר' });
  }
};
