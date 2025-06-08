const User = require('../models/User'); 
const Foodd = require('../models/Food'); 


exports.  updateKitchenItemsFromMeal = async (userId, ingredients) => {
    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            console.warn(`User with username ${userId} not found for kitchen item update.`);
            return;
        }

        for (const ingredient of ingredients) {
            const { itemName, quantity, unit } = ingredient;

         
            const existingKitchenItem = user.kitchenItems.find(
                item => item.name === itemName
            );

            if (existingKitchenItem) {
            
                if (existingKitchenItem.quantity.unit === unit) { 
                    existingKitchenItem.quantity.value += quantity.value;
                } else {
                    
                    console.warn(`Unit mismatch for ${itemName}. Not combining quantities.`);
                  
                    user.kitchenItems.push({
                        name: itemName,
                        quantity: { value: quantity.value, unit: unit },
                      
                    });
                }
            } else {
     
                user.kitchenItems.push({
                    name: itemName,
                    quantity: { value: quantity.value, unit: unit },
                 
                });
            }
        }
        await user.save();
        console.log(`Kitchen items updated for user ${userId}.`);
    } catch (error) {
        console.error('Error updating kitchen items from meal ingredients:', error);
    }
};



exports.addFoodToUser = async (req, res) => {
    const { userId } = req.params;
    const { name, imageUrl, ingredients } = req.body;

  
    if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: 'שם המאכל ורכיבים נדרשים.' });
    }

  
    for (const ingredient of ingredients) {
        if (!ingredient.itemName || !ingredient.quantity || typeof ingredient.quantity.value !== 'number' || !ingredient.quantity.unit) {
            return res.status(400).json({ message: 'כל רכיב חייב לכלול שם, כמות ויחידת מידה תקינים.' });
        }
    }

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

      
        const newMeal = new Foodd({ 
            name,
            imageUrl,
            ingredients: ingredients.map(ing => ({
                itemName: ing.itemName,
                quantity: {
                    value: ing.quantity.value,
                    unit: ing.quantity.unit
                }
            }))
        });
        const savedMeal = await newMeal.save();
            user.food.push({
            mealId: savedMeal._id,
            name: savedMeal.name,
            imageUrl: savedMeal.imageUrl
        });
        await user.save();
            res.status(200).json({
            message: 'המאכל נוסף בהצלחה למשתמש!',
            meal: savedMeal,
           userMealEntry: user.food[user.food.length - 1] 
      });

    } catch (error) {
        console.error('שגיאה בהוספת מאכל למשתמש:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: 'שגיאה בשרת בעת הוספת המאכל.' });
    }
};


exports.getAllFoodForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ username: userId }).populate({
            path: 'food.mealId',
            model: 'Meal'
        });

        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

     
        const userMeals = user.food.map(userMeal => {
            if (userMeal.mealId) {
                return {
                    _id: userMeal.mealId._id,
                    name: userMeal.mealId.name,
                    imageUrl: userMeal.mealId.imageUrl,
                    ingredients: userMeal.mealId.ingredients,
                   
                };
            }
            return null;
        }).filter(Boolean); 

        res.status(200).json(userMeals);

    } catch (error) {
        console.error('שגיאה בשליפת מאכלים עבור משתמש:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת שליפת המאכלים.' });
    }
};


exports.deleteFoodFromUser = async (req, res) => {
    const { userId, foodId } = req.params; 

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

     
        const initialMealsCount = user.food.length;
        user.food = user.food.filter(meal => meal.mealId.toString() !== foodId);

        if (user.food.length === initialMealsCount) {
            return res.status(404).json({ message: 'המאכל לא נמצא ברשימת המאכלים של המשתמש.' });
        }

        await user.save();

        
        await Foodd.findByIdAndDelete(foodId);
        console.log(`Meal document with ID ${foodId} deleted.`);

        res.status(200).json({ message: 'המאכל נמחק בהצלחה מרשימת המאכלים של המשתמש.' });

    } catch (error) {
        console.error('שגיאה במחיקת מאכל ממשתמש:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת מחיקת המאכל.' });
    }
};


exports.updateFoodForUser = async (req, res) => {
    const { userId, foodId } = req.params; 
    const { name, imageUrl, ingredients } = req.body;

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

       
        const userMealEntry = user.meals.find(meal => meal.mealId.toString() === foodId);
        if (!userMealEntry) {
            return res.status(404).json({ message: 'המאכל לא נמצא ברשימת המאכלים של המשתמש.' });
        }

       
        const updatedMeal = await Foodd.findByIdAndUpdate(
            foodId,
            { name, imageUrl, ingredients },
            { new: true, runValidators: true }
        );

        if (!updatedMeal) {
            return res.status(404).json({ message: 'המאכל לא נמצא במסד הנתונים.' });
        }

       
        userMealEntry.name = updatedMeal.name;
        userMealEntry.imageUrl = updatedMeal.imageUrl;
        await user.save();

        res.status(200).json({
            message: 'המאכל עודכן בהצלחה!',
            updatedMeal: updatedMeal
        });

    } catch (error) {
        console.error('שגיאה בעדכון מאכל עבור משתמש:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: 'שגיאה בשרת בעת עדכון המאכל.' });
    }
};