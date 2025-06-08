
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
     console.log(existingItemInKitchen)
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
        quantity: savedItem.quantity,
           imageUrl: savedItem.imageUrl, 
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
exports.deleteProduct = async (req, res) => {
   
    const { userId } = req.params;
   
    const { productId } = req.params;
console.log('--- ניסיון מחיקת מוצר ---');
    console.log('userId שהתקבל ב-URL:', userId);
    console.log('productId שהתקבל ב-URL:', productId);
    try {
               const user = await UserSchema.findOne({ username: userId }); 
               if (!user) {
            return res.status(404).json({ message: 'משתמש לא קיים.' });
        }

          console.log('כל המוצרים במערך kitchenItems של המשתמש:', user.kitchenItems);
           
const itemIndex = user.kitchenItems.findIndex(item => item.itemId.toString() === productId);
             if (itemIndex === -1) {
            return res.status(404).json({ message: 'המוצר לא נמצא במטבח של המשתמש.' });
        }
         user.kitchenItems.splice(itemIndex, 1);
             await user.save();
         res.status(200).json({ message: 'המוצר נמחק בהצלחה מהמטבח.' });
    } catch (error) {
        console.error('שגיאה במחיקת מוצר:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת מחיקת המוצר.' });
    }
};

exports.updateKitchenItem = async (req, res) => {
    try {
        const { userId, productId } = req.params; 
        const { name, quantity, imageUrl, category } = req.body;

        const user = await UserSchema.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        
        const itemIndexInUserKitchen = user.kitchenItems.findIndex(item => item.itemId.toString() === productId);

        if (itemIndexInUserKitchen === -1) {
            return res.status(404).json({ message: 'הפריט לא נמצא במטבח של המשתמש.' });
        }

        const itemInUserKitchen = user.kitchenItems[itemIndexInUserKitchen];

       
        if (name !== undefined) {
            itemInUserKitchen.name = name; 
        }
        if (quantity !== undefined) {
            itemInUserKitchen.quantity = quantity;
        }
       
        await user.save();

      
        const originalItem = await Item.findById(itemInUserKitchen.itemId);
        if (originalItem) {
            if (name !== undefined) {
                originalItem.name = name;
            }
            if (quantity !== undefined) {
                originalItem.quantity = quantity;
            }
            if (imageUrl !== undefined) {
                originalItem.imageUrl = imageUrl;
            }
            if (category !== undefined) { 
                originalItem.category = category;
            }
            await originalItem.save();
        } else {
            console.warn(`אזהרה: פריט עם ID ${itemInUserKitchen.itemId} לא נמצא בקולקציית Item אך קיים במטבח של המשתמש ${userId}.`);
        }

        res.status(200).json({
            message: 'הפריט עודכן בהצלחה!',
            updatedUserItem: itemInUserKitchen.toObject(),
            updatedOriginalItem: originalItem ? originalItem.toObject() : null
        });
    } catch (error) {
        console.error('שגיאה בעדכון מוצר במטבח המשתמש:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת עדכון מוצר', error: error.message });
    }
};


