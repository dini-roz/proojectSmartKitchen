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

            // Check if the item already exists in the user's kitchen
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
                        // imageUrl and category would be tricky here unless you have an Item model for ingredients
                    });
                }
            } else {
                // If the item doesn't exist, add it to kitchenItems
                user.kitchenItems.push({
                    name: itemName,
                    quantity: { value: quantity.value, unit: unit },
                    // You might need to fetch imageUrl and category from a global Item collection if available,
                    // or leave them undefined if ingredients are just names and quantities for meals.
                });
            }
        }
        await user.save();
        console.log(`Kitchen items updated for user ${userId}.`);
    } catch (error) {
        console.error('Error updating kitchen items from meal ingredients:', error);
    }
};


// --- Add Food (Meal) to a User ---
exports.addFoodToUser = async (req, res) => {
    const { userId } = req.params;
    const { name, imageUrl, ingredients } = req.body;

    // Validate incoming data
    if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ message: 'שם המאכל ורכיבים נדרשים.' });
    }

    // Validate ingredients structure
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

        // Create the new meal
        const newMeal = new Foodd({ // ודא ש-'Foodd' הוא שם המודל הנכון למאכלים שלך
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
            model: 'Meal' // Specify the model name for population
        });

        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        // Map the populated meals to a cleaner structure if needed
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
    const { userId, foodId } = req.params; // foodId here refers to the Meal document's _id

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        // Remove the meal reference from the user's meals array
        const initialMealsCount = user.food.length;
        user.food = user.food.filter(meal => meal.mealId.toString() !== foodId);

        if (user.food.length === initialMealsCount) {
            return res.status(404).json({ message: 'המאכל לא נמצא ברשימת המאכלים של המשתמש.' });
        }

        await user.save();

        // Optionally, delete the actual Meal document if no other user references it
        // This logic can be complex for shared meals. For simplicity, we'll just delete it
        // if this user is the only one who might have created it, or if it's fine to delete globally.
        // For a more robust solution, you might count references or make meals shared.
        await Foodd.findByIdAndDelete(foodId);
        console.log(`Meal document with ID ${foodId} deleted.`);

        res.status(200).json({ message: 'המאכל נמחק בהצלחה מרשימת המאכלים של המשתמש.' });

    } catch (error) {
        console.error('שגיאה במחיקת מאכל ממשתמש:', error);
        res.status(500).json({ message: 'שגיאה בשרת בעת מחיקת המאכל.' });
    }
};

// --- Update Food (Meal) for a User ---
exports.updateFoodForUser = async (req, res) => {
    const { userId, foodId } = req.params; // foodId refers to the Meal document's _id
    const { name, imageUrl, ingredients } = req.body;

    try {
        const user = await User.findOne({ username: userId });
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא.' });
        }

        // Find the meal entry in the user's array
        const userMealEntry = user.meals.find(meal => meal.mealId.toString() === foodId);
        if (!userMealEntry) {
            return res.status(404).json({ message: 'המאכל לא נמצא ברשימת המאכלים של המשתמש.' });
        }

        // Update the actual Meal document
        const updatedMeal = await Foodd.findByIdAndUpdate(
            foodId,
            { name, imageUrl, ingredients },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedMeal) {
            return res.status(404).json({ message: 'המאכל לא נמצא במסד הנתונים.' });
        }

        // Update the cached data in the user's meals array if needed (optional, as we populate)
        userMealEntry.name = updatedMeal.name;
        userMealEntry.imageUrl = updatedMeal.imageUrl;
        await user.save(); // Save user to update any cached meal info

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