
// import React from 'react';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import { selectAllProducts, selectCurrentUserName } from '../users/api/authSlice'; // ייבוא selectCurrentUserName
// import { selectSelectedFoodItem } from '../food/foodSlice';
// import { Box, Typography, Button, CircularProgress } from '@mui/material'; // ייבוא CircularProgress
// import { useAddShoppingListItemMutation } from '../item/itemApi '; // ייבוא המוטציה
// import { useAppDispatch } from '../../app/hooks/useAppDispatch'; // ייבוא useAppDispatch
// import { updeteShopingliste } from '../users/api/authSlice'; // ייבוא updeteShopingliste

// const FoodIngredientsCheck: React.FC = () => {
//     const selectedFood = useAppSelector(selectSelectedFoodItem);
//     const kitchenItems = useAppSelector(selectAllProducts);
//     const currentUserName = useAppSelector(selectCurrentUserName); // קבלת שם המשתמש הנוכחי

//     const dispatch = useAppDispatch(); // קבלת פונקציית dispatch

//     // שימוש במוטציה
//     const [addShoppingListItem, { isLoading }] = useAddShoppingListItemMutation();

//     if (kitchenItems === null) {
//         return null; // או מחוון טעינה/הודעה
//     }

//     if (!selectedFood || !selectedFood.name) {
//         return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
//     }

//     const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
//         const kitchenItem = kitchenItems.find(item => item.name === ingredient.itemName);

//         const requiredAmount = ingredient.quantity.value;
//         const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

//         const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

//         return {
//             ingredient,
//             exists: !!kitchenItem,
//             sufficientStock: hasSufficientStock,
//             availableAmount: availableAmount, // הוספת כמות זמינה לצורך חישוב חוסר
//         };
//     });

//     // בדיקה אם כל המרכיבים קיימים ובמלאי מספיק
//     const allIngredientsAvailable = ingredientStatus.every(
//         (status) => status.exists && status.sufficientStock
//     );

//     const handlePrepareClick = () => {
//         // לוגיקה שתופעל בלחיצה על כפתור "הכנה"
//         alert(`מתחילים להכין את ${selectedFood.name}!`);
//         // כאן תוכל להוסיף לוגיקה נוספת, כמו הפחתת כמות המוצרים מהמלאי
//         // או ניווט לדף עם הוראות הכנה.
//     };

//     const handleAddtoShoppingList = async (ingredientName: string, requiredAmount: number, availableAmount: number) => {
//         if (!currentUserName) {
//             console.error('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
//             alert('כדי להוסיף לרשימת הקניות, אנא התחבר לחשבונך.');
//             return;
//         }

//         const quantityToAdd = requiredAmount - availableAmount; // נניח שצריך להוסיף את החוסר
//         if (quantityToAdd <= 0) {
//             console.warn(`המרכיב ${ingredientName} כבר קיים בכמות מספקת או יותר.`);
//             alert(`המרכיב ${ingredientName} כבר קיים בכמות מספקת.`);
//             return;
//         }

//         try {
//             // קריאה למוטציה
//             const result = await addShoppingListItem({ 
//                 userId: currentUserName, 
//                 name: ingredientName, 
//                 quantity: quantityToAdd 
//             }).unwrap();
//             console.log('פריט נוסף לרשימת קניות:', result);
//             alert(`המרכיב "${ingredientName}" נוסף לרשימת הקניות.`);
//             // אם יש צורך לרענן את רשימת הקניות בתצוגה, נבצע dispatch
//             // ייתכן שתצטרך מנגנון לריענון המידע של רשימת הקניות בקומפוננטות אחרות
//             // או שתוכל לבצע refetch אם יש לך access ל-query hook המתאים
//             // לדוגמה, אם יש לך useGetShoppingListQuery במקום נגיש:
//             // const { refetch: refetchShoppingList } = useGetShoppingListQuery(currentUserName);
//             // refetchShoppingList();
            
//             // מכיוון שיש לנו את `updeteShopingliste`, אנו יכולים לעדכן את הסטייט באופן ישיר.
//             // יש לוודא שה-API של `addShoppingListItem` מחזיר את רשימת הקניות המעודכנת
//             // או שנצטרך לבצע קריאת `refetch` ל-`getShoppingList` אחרי ההוספה.
//             // בהנחה שה-API מחזיר את כל ה-user עם shoppingList מעודכן:
//             if (result && result.user && result.user.shoppingList) {
//                 dispatch(updeteShopingliste(result.user.shoppingList));
//             }

//         } catch (error) {
//             console.error('שגיאה בהוספת פריט לרשימת קניות:', error);
//             alert('שגיאה בהוספת פריט לרשימת קניות.');
//         }
//     };

//     return (
//         <Box>
//             <Typography variant="h5">מרכיבים עבור {selectedFood.name}:</Typography>
//             {ingredientStatus.map(({ ingredient, exists, sufficientStock, availableAmount }, index) => (
//                 <Box key={index} sx={{ margin: '10px 0' }}>
//                     <Typography
//                         variant="body1"
//                         style={{ color: exists ? (sufficientStock ? 'green' : 'red') : 'orange' }}
//                     >
//                         {ingredient.itemName}: {ingredient.quantity.value} {ingredient.quantity.unit} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${ingredient.quantity.value - availableAmount} ${ingredient.quantity.unit} במלאי`) : 'לא קיים'}
//                     </Typography>
//                     {!sufficientStock && ( // הכפתור יופיע אם המלאי לא מספיק (כולל אם לא קיים כלל)
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleAddtoShoppingList(ingredient.itemName, ingredient.quantity.value, availableAmount)}
//                             disabled={isLoading} // נטרול הכפתור בזמן טעינה
//                         >
//                             {isLoading ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
//                         </Button>
//                     )}
//                 </Box>
//             ))}

//             {/* כפתור "הכנה" יופיע רק אם כל המרכיבים זמינים */}
//             {allIngredientsAvailable && (
//                 <Button variant="contained" color="success" onClick={handlePrepareClick} sx={{ marginTop: '20px' }}>
//                     הכנה
//                 </Button>
//             )}
//         </Box>
//     );
// };

// export default FoodIngredientsCheck;
// import React from 'react';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import {
//     selectAllProducts,
//     selectCurrentUserName,
//     // useUpdateProductQuantityMutation // מוסר מפה - הוא נמצא ב-itemApi
// } from '../users/api/authSlice'; // כדאי לוודא שאין כאן ייבוא כפול
// import { selectSelectedFoodItem } from '../food/foodSlice';
// import { Box, Typography, Button, CircularProgress } from '@mui/material';
// import {
//     useAddShoppingListItemMutation,
//     useUpdateProductQuantityMutation // ייבוא המוטציה מכאן
// } from '../item/itemApi '; // וודא ש-itemApi מכיל את המוטציה הזו
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// import { updeteShopingliste } from '../users/api/authSlice'; // ייבוא updeteShopingliste

// // פונקציית עזר לנרמול שמות
// const normalizeName = (name: string): string => {
//     return name.toLowerCase().trim();
// };

// const FoodIngredientsCheck: React.FC = () => {
//     const selectedFood = useAppSelector(selectSelectedFoodItem);
//     const kitchenItems = useAppSelector(selectAllProducts);
//     const currentUserName = useAppSelector(selectCurrentUserName);

//     const dispatch = useAppDispatch();

//     const [addShoppingListItem, { isLoading: isAddingToShoppingList }] = useAddShoppingListItemMutation();
//     const [updateProductQuantity, { isLoading: isUpdatingQuantity }] = useUpdateProductQuantityMutation();


//     if (kitchenItems === null) {
//         return null; // או מחוון טעינה/הודעה
//     }

//     if (!selectedFood || !selectedFood.name) {
//         return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
//     }

//     const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
//         // נרמל את שם המרכיב לצורך השוואה
//         const normalizedIngredientName = normalizeName(ingredient.itemName);
//         const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

//         const requiredAmount = ingredient.quantity.value;
//         const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

//         const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

//         return {
//             ingredient, // שמור את האובייקט המקורי
//             exists: !!kitchenItem,
//             sufficientStock: hasSufficientStock,
//             availableAmount: availableAmount,
//         };
//     });

//     const allIngredientsAvailable = ingredientStatus.every(
//         (status) => status.exists && status.sufficientStock
//     );

//     const handlePrepareClick = async () => {
//         if (!currentUserName) {
//             alert('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
//             return;
//         }

//         if (!allIngredientsAvailable) {
//             alert('לא ניתן להכין את המאכל. ישנם מרכיבים חסרים או לא מספקים במלאי.');
//             return;
//         }

//         try {
//             const updatePromises = ingredientStatus.map(async ({ ingredient }) => {
//                 // מצא שוב את הפריט לפי שם מנורמל, כדי להיות בטוח
//                 const normalizedIngredientName = normalizeName(ingredient.itemName);
//                 const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

//                 if (kitchenItem) {
//                     const newQuantity = kitchenItem.quantity - ingredient.quantity.value;
//                     // וודא שאתה שולח את השם המקורי לשרת, אלא אם השרת מצפה לשם מנורמל ב-URL
//                     // אם ה-URL נקטע, זה סימן שצריך לשלוח שם מלא.
//                     // נשלח את השם המקורי של המרכיב מהמתכון.
//                     console.log('Attempting to update:', {
//                         userId: currentUserName,
//                         productName: ingredient.itemName, // השם המקורי
//                         newQuantity: newQuantity,
//                     });
//                     await updateProductQuantity({
//                         userId: currentUserName,
//                         productName: ingredient.itemName, // שימוש בשם המקורי כפי שהוא
//                         newQuantity: newQuantity,
//                     }).unwrap();
//                 } else {
//                     console.warn(`Attempted to update a missing kitchen item: ${ingredient.itemName}`);
//                 }
//             });

//             await Promise.all(updatePromises);

//             alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו במלאי.`);
//             // רענון ה-kitchenItems אם ה-invalidatesTags לא עובד אוטומטית
//             // (לדוגמה, אם יש לך query Hook ספציפי ל-kitchenItems)
//             // אם ה-useUpdateProductQuantityMutation מוגדר עם invalidatesTags
//             // כמו { type: 'Item', id: userId } או { type: 'Product', id: 'LIST' },
//             // אז ה-query שאחראי על ה-kitchenItems ירוענן אוטומטית.
//             // אין צורך ב-dispatch ספציפי כאן אם ה-RTK Query מוגדר נכון.

//         } catch (error) {
//             console.error('שגיאה בהכנת המאכל או בעדכון מלאי:', error);
//             alert('אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.');
//         }
//     };


//     const handleAddtoShoppingList = async (ingredientName: string, requiredAmount: number, availableAmount: number) => {
//         if (!currentUserName) {
//             console.error('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
//             alert('כדי להוסיף לרשימת הקניות, אנא התחבר לחשבונך.');
//             return;
//         }

//         const quantityToAdd = requiredAmount - availableAmount;
//         if (quantityToAdd <= 0) {
//             console.warn(`המרכיב ${ingredientName} כבר קיים בכמות מספקת או יותר.`);
//             alert(`המרכיב ${ingredientName} כבר קיים בכמות מספקת.`);
//             return;
//         }

//         try {
//             const result = await addShoppingListItem({
//                 userId: currentUserName,
//                 name: ingredientName,
//                 quantity: quantityToAdd
//             }).unwrap();
//             console.log('פריט נוסף לרשימת קניות:', result);
//             alert(`המרכיב "${ingredientName}" נוסף לרשימת הקניות.`);

//             if (result && result.user && result.user.shoppingList) {
//                 dispatch(updeteShopingliste(result.user.shoppingList));
//             }

//         } catch (error) {
//             console.error('שגיאה בהוספת פריט לרשימת קניות:', error);
//             alert('שגיאה בהוספת פריט לרשימת קניות.');
//         }
//     };

//     return (
//         <Box>
//             <Typography variant="h5">מרכיבים עבור {selectedFood.name}:</Typography>
//             {ingredientStatus.map(({ ingredient, exists, sufficientStock, availableAmount }, index) => (
//                 <Box key={index} sx={{ margin: '10px 0' }}>
//                     <Typography
//                         variant="body1"
//                         style={{ color: exists ? (sufficientStock ? 'green' : 'red') : 'orange' }}
//                     >
//                         {ingredient.itemName}: {ingredient.quantity.value} {ingredient.quantity.unit} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${ingredient.quantity.value - availableAmount} ${ingredient.quantity.unit} במלאי`) : 'לא קיים'}
//                     </Typography>
//                     {!sufficientStock && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleAddtoShoppingList(ingredient.itemName, ingredient.quantity.value, availableAmount)}
//                             disabled={isAddingToShoppingList}
//                         >
//                             {isAddingToShoppingList ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
//                         </Button>
//                     )}
//                 </Box>
//             ))}

//             {/* כפתור "הכנה" יופיע רק אם כל המרכיבים זמינים */}
//             {allIngredientsAvailable && (
//                 <Button
//                     variant="contained"
//                     color="success"
//                     onClick={handlePrepareClick}
//                     sx={{ marginTop: '20px' }}
//                     disabled={isUpdatingQuantity}
//                     startIcon={isUpdatingQuantity ? <CircularProgress size={20} color="inherit" /> : null}
//                 >
//                     {isUpdatingQuantity ? 'מעדכן מלאי...' : 'הכנה'}
//                 </Button>
//             )}
//         </Box>
//     );
// };

// export default FoodIngredientsCheck;
import React from 'react';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import {
    selectAllProducts,
    selectCurrentUserName,
} from '../users/api/authSlice';
import { selectSelectedFoodItem } from '../food/foodSlice';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import {
    useAddShoppingListItemMutation,
    useUpdateProductQuantityMutation
} from '../item/itemApi ';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';
import { updeteShopingliste } from '../users/api/authSlice';

// פונקציית עזר לנרמול שמות (אותיות קטנות והסרת רווחים)
const normalizeName = (name: string): string => {
    return name.toLowerCase().trim();
};

const FoodIngredientsCheck: React.FC = () => {
    const selectedFood = useAppSelector(selectSelectedFoodItem);
    const kitchenItems = useAppSelector(selectAllProducts);
    const currentUserName = useAppSelector(selectCurrentUserName);
    const dispatch = useAppDispatch();

    const [addShoppingListItem, { isLoading: isAddingToShoppingList }] = useAddShoppingListItemMutation();
    const [updateProductQuantity, { isLoading: isUpdatingQuantity }] = useUpdateProductQuantityMutation();

    if (kitchenItems === null) {
        return null; // או מחוון טעינה/הודעה מתאים
    }

    if (!selectedFood || !selectedFood.name) {
        return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
    }

    // זהו ה-log החשוב ביותר: בדוק את המבנה המדויק של ingredients
    console.log("Selected Food Object:", selectedFood); // לוג של כל האובייקט
    console.log("Selected Food Ingredients structure:", selectedFood.ingredients);

    const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
        // ודא איזה נכס באובייקט המרכיב מכיל את השם בפועל (name או itemName)
        const ingredientName = ingredient.name || ingredient.itemName; 
        
        console.log(`Processing ingredient:`, ingredient, `Identified name:`, ingredientName);

        if (!ingredientName) {
            console.warn("Ingredient missing 'name' or 'itemName' property:", ingredient);
            // החזר סטטוס שגוי אם אין שם למרכיב, כדי שלא ננסה לעבד אותו
            return {
                ingredient,
                exists: false,
                sufficientStock: false,
                availableAmount: 0,
            };
        }

        const normalizedIngredientName = normalizeName(ingredientName);
        const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

        const requiredAmount = ingredient.quantity?.value || 0; // גישה בטוחה ל-value
        const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

        const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

        return {
            ingredient,
            exists: !!kitchenItem,
            sufficientStock: hasSufficientStock,
            availableAmount: availableAmount,
        };
    });

    const allIngredientsAvailable = ingredientStatus.every(
        (status) => status.exists && status.sufficientStock
    );

    const handlePrepareClick = async () => {
        if (!currentUserName) {
            alert('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
            return;
        }

        if (!allIngredientsAvailable) {
            alert('לא ניתן להכין את המאכל. ישנם מרכיבים חסרים או לא מספקים במלאי.');
            return;
        }

        try {
            const updatePromises = ingredientStatus.map(async (status) => {
                const ingredient = status.ingredient;
                const ingredientName = ingredient.name || ingredient.itemName; 

                if (!ingredientName) {
                    console.error("Cannot process ingredient due to missing name:", ingredient);
                    throw new Error("Ingredient name is missing for: " + JSON.stringify(ingredient));
                }

                const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizeName(ingredientName));

                if (kitchenItem) {
                    const newQuantity = kitchenItem.quantity - (ingredient.quantity?.value || 0);
                    
                    console.log('Attempting to update quantity for:', {
                        userId: currentUserName,
                        productName: ingredientName, // ודא שזה השם המלא הנכון!
                        newQuantity: newQuantity,
                    });

                    await updateProductQuantity({
                        userId: currentUserName,
                        productName: ingredientName, 
                        newQuantity: newQuantity,
                    }).unwrap(); // .unwrap() זורק שגיאה אם ה-API מחזיר שגיאה (לדוגמה 404, 500)
                } else {
                    console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
                    // במקרה זה, אולי עדיף לזרוק שגיאה כדי לעצור את התהליך:
                    // throw new Error(`Item '${ingredientName}' not found in kitchen, cannot update.`);
                }
            });

            await Promise.all(updatePromises); // ימתין לכל העדכונים או יזרוק את השגיאה הראשונה

            alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו במלאי.`);

        } catch (error) {
            // **טיפול שגיאות מפורט יותר**
            console.error('שגיאה מפורטת בעת הכנת המאכל או בעדכון מלאי:', error);

            let alertMessage = 'אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.';
            
            // בדיקה אם זו שגיאה של RTK Query
            if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
                const rtkError = error as { status: number | string; data: any; error?: string };
                alertMessage += ` (סטטוס: ${rtkError.status}`;
                if (rtkError.data) {
                    // נסה לנתח את ה-data אם הוא אובייקט עם הודעה
                    if (typeof rtkError.data === 'object' && rtkError.data.message) {
                        alertMessage += `, פרטי שרת: ${rtkError.data.message}`;
                    } else if (typeof rtkError.data === 'string') {
                        // אם ה-data הוא HTML (כמו בדוגמה שצוינה: <!DOCTYPE html>...)
                        if (rtkError.data.startsWith('<!DOCTYPE html>')) {
                            alertMessage += `. השרת החזיר HTML, ייתכן שגיאת נתיב API. בדוק את URL: /api/users/${currentUserName}/kitchen-items/{שם_מרכיב}`;
                        } else {
                            alertMessage += `, פרטי שרת: ${rtkError.data}`;
                        }
                    } else {
                        alertMessage += `, פרטי שרת: ${JSON.stringify(rtkError.data)}`;
                    }
                }
                if (rtkError.error) {
                    alertMessage += `, שגיאת RTK: ${rtkError.error}`;
                }
                alertMessage += `)`;
            } else if (error instanceof Error) {
                alertMessage += ` פרטי השגיאה: ${error.message}`;
            } else if (typeof error === 'string') {
                alertMessage += ` פרטי השגיאה: ${error}`;
            }

            alert(alertMessage);
        }
    };

    const handleAddtoShoppingList = async (ingredientName: string, requiredAmount: number, availableAmount: number) => {
        if (!currentUserName) {
            console.error('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
            alert('כדי להוסיף לרשימת הקניות, אנא התחבר לחשבונך.');
            return;
        }

        const quantityToAdd = requiredAmount - availableAmount;
        if (quantityToAdd <= 0) {
            console.warn(`המרכיב ${ingredientName} כבר קיים בכמות מספקת או יותר.`);
            alert(`המרכיב ${ingredientName} כבר קיים בכמות מספקת.`);
            return;
        }

        try {
            const result = await addShoppingListItem({
                userId: currentUserName,
                name: ingredientName,
                quantity: quantityToAdd
            }).unwrap();
            console.log('פריט נוסף לרשימת קניות:', result);
            alert(`המרכיב "${ingredientName}" נוסף לרשימת הקניות.`);

            if (result && result.user && result.user.shoppingList) {
                dispatch(updeteShopingliste(result.user.shoppingList));
            }

        } catch (error) {
            console.error('שגיאה בהוספת פריט לרשימת קניות:', error);
            alert('שגיאה בהוספת פריט לרשימת קניות.');
        }
    };

    return (
        <Box>
            <Typography variant="h5">מרכיבים עבור {selectedFood.name}:</Typography>
            {ingredientStatus.map(({ ingredient, exists, sufficientStock, availableAmount }, index) => (
                <Box key={index} sx={{ margin: '10px 0' }}>
                    <Typography
                        variant="body1"
                        style={{ color: exists ? (sufficientStock ? 'green' : 'red') : 'orange' }}
                    >
                        {/* ודא שאתה מציג את השם הנכון */}
                        {(ingredient.name || ingredient.itemName) + ': ' + (ingredient.quantity?.value || 0) + ' ' + (ingredient.quantity?.unit || '')} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${(ingredient.quantity?.value || 0) - availableAmount} ${ingredient.quantity?.unit || ''} במלאי`) : 'לא קיים'}
                    </Typography>
                    {!sufficientStock && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAddtoShoppingList((ingredient.name || ingredient.itemName), (ingredient.quantity?.value || 0), availableAmount)}
                            disabled={isAddingToShoppingList}
                        >
                            {isAddingToShoppingList ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
                        </Button>
                    )}
                </Box>
            ))}

            {allIngredientsAvailable && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={handlePrepareClick}
                    sx={{ marginTop: '20px' }}
                    disabled={isUpdatingQuantity}
                    startIcon={isUpdatingQuantity ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isUpdatingQuantity ? 'מעדכן מלאי...' : 'הכנה'}
                </Button>
            )}
        </Box>
    );
};

export default FoodIngredientsCheck;