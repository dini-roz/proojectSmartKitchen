
const User = require("../models/User");
const Item = require('../models/Item'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
exports.createUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            name: req.body.name,
            password: hashedPassword, 
            paymentDetails: req.body.paymentDetails,
            email: req.body.email,
            phone: req.body.phone,
            kitchenItems: [],
            shoppingList: [], 
            food: []   
        });

    await newUser.save();
       res.status(200).json({ message: "User created successfully", user: newUser });
                 
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

exports.getUser = async (req, res) => {
    const { userName } = req.params;
    try {

        const user = await User.findOne({ username: userName }); 
       
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user", error });
    }
};
exports.loginUser = async (req, res) => {
    console.log("hloow login")
    const { email, password } = req.body;
    console.log('Attempting login for email:', email);
    try {
        const user = await User.findOne({ email });
          console.log('User found:', user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
       
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
       
        res.status(200).json({ message: "User created successfully", user: user });
        console.log(user.password)
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};
exports.addShoppingListItem = async (req, res) => {
  const { userId } = req.params;
  const { name, quantity } = req.body;

 
  if (!name || !quantity) {
    return res.status(400).json({ message: 'שם מוצר וכמות נדרשים.' });
  }
  if (typeof name !== 'string' || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: 'פורמט שגוי לשם מוצר או כמות.' });
  }

  try {
   const user = await User.findOne({ username: userId });

    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא.' });
    }

   
    user.shoppingList.push({ name, quantity });
    await user.save();

    res.status(200).json({ message: 'המוצר נוסף בהצלחה לרשימת הקניות.', user });

  } catch (error) {
    console.error('שגיאה בהוספת פריט לרשימת קניות:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת הוספת פריט לרשימת קניות.' });
  }
};



exports.getShoppingList = async (req, res) => {
  const { userId } = req.params; 

  try {
  
    const user = await User.findOne({ username: userId });

    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא.' });
    }

 
    const shoppingList = user.shoppingList.map(item => ({
         _id: item._id, 
      name: item.name,
      quantity: item.quantity,
     
     
    }));

  
    res.status(200).json(shoppingList);
  } catch (error) {
    console.error('שגיאה בקבלת רשימת קניות:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת קבלת רשימת הקניות.' });
  }
};
exports.deleteShoppingListItem = async (req, res) => {
    const { userId, itemId } = req.params; // userId כאן הוא ה-username, itemId הוא ה-_id של הפריט

    try {
        const user = await User.findOne({ username: userId }); // מציאת משתמש לפי username

        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        // מציאת אינדקס הפריט ברשימת הקניות לפי ה-_id שלו
        const initialLength = user.shoppingList.length; // אורך לפני מחיקה
        user.shoppingList = user.shoppingList.filter(
            (item) => item._id && item._id.toString() !== itemId // מסנן החוצה את הפריט עם ה-_id התואם
        );

        // בדיקה אם פריט אכן נמחק
        if (user.shoppingList.length === initialLength) {
            return res.status(404).json({ message: 'פריט ברשימת הקניות לא נמצא.' });
        }

        await user.save(); // שמירת המשתמש המעודכן

        res.status(200).json({ message: 'הפריט נמחק בהצלחה מרשימת הקניות.', itemId });

    } catch (error) {
        console.error('שגיאה במחיקת פריט מרשימת קניות:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת מחיקת פריט מרשימת קניות.', error: error.message });
    }
};

exports.addPurchasedItem = async (req, res) => {
    const { userId } = req.params;
    
    const { name, quantity, imageUrl, category } = req.body;

    
    if (!name || !quantity) {
        return res.status(400).json({ message: 'שם מוצר וכמות נדרשים עבור פריט שנרכש.' });
    }

    
    const parsedQuantity = parseFloat(quantity); 

    // בדיקות ולידציה משופרות
    if (typeof name !== 'string' || isNaN(parsedQuantity) || parsedQuantity < 1) {
        return res.status(400).json({ message: 'פורמט שגוי לשם מוצר או כמות עבור פריט שנרכש. ודא שהכמות היא מספר חוקי וגדולה מ-0.' });
    }

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        const existingItemInKitchen = user.kitchenItems.find(item => item.name === name);

        if (existingItemInKitchen) {
          
            const currentKitchenQuantity = parseFloat(existingItemInKitchen.quantity); 
            
            
            if (isNaN(currentKitchenQuantity)) {
                console.warn(`Problem: existingItemInKitchen.quantity for ${name} is not a valid number. Defaulting to 0.`);
                existingItemInKitchen.quantity = parsedQuantity; 
            } else {
                existingItemInKitchen.quantity = currentKitchenQuantity + parsedQuantity;
            }
            
            await user.save();

            
            try {
                const itemToUpdate = await Item.findById(existingItemInKitchen.itemId);
                if (itemToUpdate) {
                  
                    itemToUpdate.quantity = parseFloat(itemToUpdate.quantity) + parsedQuantity;
                    await itemToUpdate.save();
                }
            } catch (error) {
                console.error('שגיאה בעדכון כמות הפריט במסמך Item לאחר רכישה:', error);
            }

            return res.status(200).json({
                message: 'כמות המוצר במטבח עודכנה בהצלחה (פריט נרכש).',
                userKitchenItem: existingItemInKitchen
            });
        } else {
            
            const newItem = new Item({
                name,
                quantity: parsedQuantity, 
                imageUrl: imageUrl || '',
                category: category || 'חלב', 
            });
            const savedItem = await newItem.save();

            user.kitchenItems.push({
                itemId: savedItem._id,
                name: savedItem.name,
                quantity: savedItem.quantity, 
                imageUrl: savedItem.imageUrl, 
            });
            await user.save();

            return res.status(201).json({
                message: 'המוצר נוסף בהצלחה למטבח כפריט נרכש.',
                item: savedItem,
                userKitchenItem: user.kitchenItems[user.kitchenItems.length - 1] 
            });
        }

    } catch (error) {
        console.error('שגיאה בהוספת פריט שנרכש למטבח:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת הוספת פריט שנרכש.', error: error.message });
    }
};
// server/controllers/userController.js

// ... (other controller functions)

// exports.updateKitchenItemQuantity = async (req, res) => { // <-- Crucial part here!
//     const { userId } = req.params;
//     const productNameFromParams = req.params.productName;
//     const normalizedProductName = productNameFromParams.toLowerCase().trim();

//     const { quantity } = req.body;

//     if (typeof quantity !== 'number' || quantity < 0) {
//         return res.status(400).json({ message: 'כמות לא חוקית.' });
//     }

//     try {
//         const user = await User.findOne({ username: userId });

//         if (!user) {
//             return res.status(404).json({ message: 'משתמש לא נמצא.' });
//         }

//         const itemIndex = user.kitchenItems.findIndex(item =>
//             item.name.toLowerCase().trim() === normalizedProductName
//         );

//         if (itemIndex === -1) {
//             console.error(`פריט מטבח "<span class="math-inline">\{productNameFromParams\}" \(מנורמל\: "</span>{normalizedProductName}") לא נמצא במלאי המשתמש ${userId}.`);
//             return res.status(404).json({ message: `פריט המטבח '${productNameFromParams}' לא נמצא במלאי שלך.` });
//         }

//         user.kitchenItems[itemIndex].quantity = quantity;
//         await user.save();

//         res.status(200).json({ message: 'כמות המוצר עודכנה בהצלחה.', updatedItem: user.kitchenItems[itemIndex] });

//     } catch (error) {
//         console.error('שגיאה בעדכון כמות פריט מטבח:', error);
//         res.status(500).json({ message: 'שגיאה בשרת בעת עדכון כמות פריט מטבח.' });
//     }
// };

// // ... (other controller functions)
// In server/controllers/userController.js

exports.updateKitchenItemQuantity = async (req, res) => {
    const { userId } = req.params;
    const productNameFromParams = req.params.productName;
    const normalizedProductName = decodeURIComponent(productNameFromParams).toLowerCase().trim();

    const { quantity } = req.body;

    console.log(`[SERVER] Received update request for userId: ${userId}, productName: ${productNameFromParams}, normalized: ${normalizedProductName}, newQuantity: ${quantity}`);

    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'כמות לא חוקית.' });
    }

    try {
        const user = await User.findOne({ username: userId });

        if (!user) {
            console.error(`[SERVER] User "${userId}" not found.`);
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        console.log(`[SERVER] User "${userId}" found. Checking their kitchenItems:`);
        console.log(user.kitchenItems.map(item => ({ name: item.name, quantity: item.quantity }))); // Log kitchen items names

        const itemIndex = user.kitchenItems.findIndex(item =>
            item.name.toLowerCase().trim() === normalizedProductName
        );

        if (itemIndex === -1) {
            console.error(`[SERVER] Item "${productNameFromParams}" (normalized: "${normalizedProductName}") NOT found in user's kitchenItems.`);
            return res.status(404).json({ message: `פריט המטבח '${productNameFromParams}' לא נמצא במלאי שלך.` });
        }

        console.log(`[SERVER] Item "${productNameFromParams}" found at index ${itemIndex}. Current quantity: ${user.kitchenItems[itemIndex].quantity}. New quantity: ${quantity}`);
        user.kitchenItems[itemIndex].quantity = quantity;
        await user.save();

        console.log(`[SERVER] Successfully updated item "${productNameFromParams}".`);
        res.status(200).json({ message: 'כמות המוצר עודכנה בהצלחה.', updatedItem: user.kitchenItems[itemIndex] });

    } catch (error) {
        console.error('שגיאה בשרת בעת עדכון כמות פריט מטבח:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת עדכון כמות פריט מטבח.', error: error.message });
    }
};