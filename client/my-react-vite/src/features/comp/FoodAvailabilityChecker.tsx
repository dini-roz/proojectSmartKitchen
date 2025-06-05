
// import React from 'react';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import {
//     selectAllProducts,
//     selectCurrentUserName,
// } from '../users/api/authSlice';
// import { selectSelectedFoodItem } from '../food/foodSlice';
// import { Box, Typography, Button, CircularProgress } from '@mui/material';
// import {
//     useAddShoppingListItemMutation,
//     useUpdateProductQuantityMutation
// } from '../item/itemApi ';
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// import { updeteShopingliste } from '../users/api/authSlice';

// // פונקציית עזר לנרמול שמות (אותיות קטנות והסרת רווחים)
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
//         return null; // או מחוון טעינה/הודעה מתאים
//     }

//     if (!selectedFood || !selectedFood.name) {
//         return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
//     }

//     // זהו ה-log החשוב ביותר: בדוק את המבנה המדויק של ingredients
//     console.log("Selected Food Object:", selectedFood); // לוג של כל האובייקט
//     console.log("Selected Food Ingredients structure:", selectedFood.ingredients);

//     const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
//         // ודא איזה נכס באובייקט המרכיב מכיל את השם בפועל (name או itemName)
//         const ingredientName = ingredient.name || ingredient.itemName; 
        
//         console.log(`Processing ingredient:`, ingredient, `Identified name:`, ingredientName);

//         if (!ingredientName) {
//             console.warn("Ingredient missing 'name' or 'itemName' property:", ingredient);
//             // החזר סטטוס שגוי אם אין שם למרכיב, כדי שלא ננסה לעבד אותו
//             return {
//                 ingredient,
//                 exists: false,
//                 sufficientStock: false,
//                 availableAmount: 0,
//             };
//         }

//         const normalizedIngredientName = normalizeName(ingredientName);
//         const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

//         const requiredAmount = ingredient.quantity?.value || 0; // גישה בטוחה ל-value
//         const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

//         const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

//         return {
//             ingredient,
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
//             const updatePromises = ingredientStatus.map(async (status) => {
//                 const ingredient = status.ingredient;
//                 const ingredientName = ingredient.name || ingredient.itemName; 

//                 if (!ingredientName) {
//                     console.error("Cannot process ingredient due to missing name:", ingredient);
//                     throw new Error("Ingredient name is missing for: " + JSON.stringify(ingredient));
//                 }

//                 const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizeName(ingredientName));

//                 if (kitchenItem) {
//                     const newQuantity = kitchenItem.quantity - (ingredient.quantity?.value || 0);
                    
//                     console.log('Attempting to update quantity for:', {
//                         userId: currentUserName,
//                         productName: ingredientName, // ודא שזה השם המלא הנכון!
//                         newQuantity: newQuantity,
//                     });

//                     await updateProductQuantity({
//                         userId: currentUserName,
//                         productName: ingredientName, 
//                         newQuantity: newQuantity,
//                     }).unwrap(); // .unwrap() זורק שגיאה אם ה-API מחזיר שגיאה (לדוגמה 404, 500)
//                 } else {
//                     console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
//                     // במקרה זה, אולי עדיף לזרוק שגיאה כדי לעצור את התהליך:
//                     // throw new Error(`Item '${ingredientName}' not found in kitchen, cannot update.`);
//                 }
//             });

//             await Promise.all(updatePromises); // ימתין לכל העדכונים או יזרוק את השגיאה הראשונה

//             alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו במלאי.`);

//         } catch (error) {
//             // **טיפול שגיאות מפורט יותר**
//             console.error('שגיאה מפורטת בעת הכנת המאכל או בעדכון מלאי:', error);

//             let alertMessage = 'אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.';
            
//             // בדיקה אם זו שגיאה של RTK Query
//             if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
//                 const rtkError = error as { status: number | string; data: any; error?: string };
//                 alertMessage += ` (סטטוס: ${rtkError.status}`;
//                 if (rtkError.data) {
//                     // נסה לנתח את ה-data אם הוא אובייקט עם הודעה
//                     if (typeof rtkError.data === 'object' && rtkError.data.message) {
//                         alertMessage += `, פרטי שרת: ${rtkError.data.message}`;
//                     } else if (typeof rtkError.data === 'string') {
//                         // אם ה-data הוא HTML (כמו בדוגמה שצוינה: <!DOCTYPE html>...)
//                         if (rtkError.data.startsWith('<!DOCTYPE html>')) {
//                             alertMessage += `. השרת החזיר HTML, ייתכן שגיאת נתיב API. בדוק את URL: /api/users/${currentUserName}/kitchen-items/{שם_מרכיב}`;
//                         } else {
//                             alertMessage += `, פרטי שרת: ${rtkError.data}`;
//                         }
//                     } else {
//                         alertMessage += `, פרטי שרת: ${JSON.stringify(rtkError.data)}`;
//                     }
//                 }
//                 if (rtkError.error) {
//                     alertMessage += `, שגיאת RTK: ${rtkError.error}`;
//                 }
//                 alertMessage += `)`;
//             } else if (error instanceof Error) {
//                 alertMessage += ` פרטי השגיאה: ${error.message}`;
//             } else if (typeof error === 'string') {
//                 alertMessage += ` פרטי השגיאה: ${error}`;
//             }

//             alert(alertMessage);
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
//                         {/* ודא שאתה מציג את השם הנכון */}
//                         {(ingredient.name || ingredient.itemName) + ': ' + (ingredient.quantity?.value || 0) + ' ' + (ingredient.quantity?.unit || '')} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${(ingredient.quantity?.value || 0) - availableAmount} ${ingredient.quantity?.unit || ''} במלאי`) : 'לא קיים'}
//                     </Typography>
//                     {!sufficientStock && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleAddtoShoppingList((ingredient.name || ingredient.itemName), (ingredient.quantity?.value || 0), availableAmount)}
//                             disabled={isAddingToShoppingList}
//                         >
//                             {isAddingToShoppingList ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
//                         </Button>
//                     )}
//                 </Box>
//             ))}

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
//////////
// import React from 'react';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import {
//     selectAllProducts,
//     selectCurrentUserName,
//     updateKitchenItems,
// } from '../users/api/authSlice';
// import { selectSelectedFoodItem } from '../food/foodSlice';
// import { Box, Typography, Button, CircularProgress } from '@mui/material';
// import {
//     useAddShoppingListItemMutation,
//     useGetProductsQuery,
//     useUpdateProductQuantityMutation
// } from '../item/itemApi '; // וודא שהנתיב והייבוא נכונים
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// import { updeteShopingliste } from '../users/api/authSlice';

// // פונקציית עזר לנרמול שמות (אותיות קטנות והסרת רווחים)
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
//          const { data: productsData, refetch: refetchProducts } = useGetProductsQuery(`${currentUserName}`);
//     if (kitchenItems === null) {
//         return null; // או מחוון טעינה/הודעה מתאים
//     }

//     if (!selectedFood || !selectedFood.name) {
//         return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
//     }

//     // *** לוגים קריטיים לבדיקת מבנה הנתונים ***
//     console.log("Selected Food Object (FULL):", selectedFood);
//     console.log("Selected Food Ingredients structure (EXPAND ME):", selectedFood.ingredients);

//     const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
//         // חשוב לבדוק איזה נכס מכיל את השם הנכון: 'name' או 'itemName'
//         // על פי הלוגים שלך, 'itemName' הוא הנכס הקיים, אך ערכו שגוי ('dcd').
//         // אם הנתונים שלך יתוקנו, 'itemName' יחזיק את השם המלא.
//         const ingredientName = ingredient.itemName || ingredient.name; // קוד גמיש, אך היצמד למה שקיים בנתונים

//         console.log(`Processing ingredient:`, ingredient, `Identified name (from recipe):`, ingredientName);

//         if (!ingredientName) {
//             console.warn("Ingredient missing 'name' or 'itemName' property:", ingredient);
//             return {
//                 ingredient,
//                 exists: false,
//                 sufficientStock: false,
//                 availableAmount: 0,
//             };
//         }

//         const normalizedIngredientName = normalizeName(ingredientName);
//         const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);
        
//         console.log(`Checking kitchen for "${normalizedIngredientName}". Found:`, kitchenItem ? kitchenItem.name : "Not found in kitchen");


//         const requiredAmount = ingredient.quantity?.value || 0;
//         const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

//         const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

//         return {
//             ingredient,
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
//             const updatePromises = ingredientStatus.map(async (status) => {
//                 const ingredient = status.ingredient;
//                 const ingredientName = ingredient.itemName || ingredient.name; 

//                 if (!ingredientName) {
//                     console.error("Cannot process ingredient due to missing name:", ingredient);
//                     throw new Error("Ingredient name is missing for: " + JSON.stringify(ingredient));
//                 }

//                 const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizeName(ingredientName));

//                 if (kitchenItem) {
//                     const newQuantity = kitchenItem.quantity - (ingredient.quantity?.value || 0);
                    
//                     // *** לוג חשוב: מה נשלח לשרת ***
//                     console.log('Attempting to update quantity for:', {
//                         userId: currentUserName,
//                         productName: ingredientName, // זה חייב להיות השם האמיתי מהמטבח
//                         newQuantity: newQuantity,
//                     });

//                     await updateProductQuantity({
//                         userId: currentUserName,
//                         productName: ingredientName, // ה-productName כאן הוא מה שמופיע ב-itemName בנתוני המתכון.
//                         newQuantity: newQuantity,
//                     }).unwrap();
              
//                const updatedProductsData = await refetchProducts().unwrap();
           
          
//                          dispatch(updateKitchenItems(updatedProductsData));
              

//                 } else {
//                     console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
//                     // זה יקרה אם ה-itemName במתכון עדיין שגוי ואינו תואם פריט במטבח.
//                     throw new Error(`פריט המטבח '${ingredientName}' לא נמצא במלאי שלך. אנא וודא שהמתכון תקין.`);
//                 }
//             });

//             await Promise.all(updatePromises);

//             alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו בהצלחה במלאי.`);

//         } catch (error) {
//             console.error('שגיאה מפורטת בעת הכנת המאכל או בעדכון מלאי:', error);

//             let alertMessage = 'אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.';
            
//             if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
//                 const rtkError = error as { status: number | string; data: any; error?: string };
//                 alertMessage += ` (סטטוס: ${rtkError.status}`;
//                 if (rtkError.data) {
//                     if (typeof rtkError.data === 'object' && rtkError.data.message) {
//                         alertMessage += `, פרטי שרת: ${rtkError.data.message}`;
//                     } else if (typeof rtkError.data === 'string') {
//                         if (rtkError.data.startsWith('<!DOCTYPE html>')) {
//                             alertMessage += `. השרת החזיר HTML, ייתכן שגיאת נתיב API או שהפריט לא נמצא. בדוק את URL: /api/users/${currentUserName}/kitchen-items/{שם_מרכיב}`;
//                         } else {
//                             alertMessage += `, פרטי שרת: ${rtkError.data}`;
//                         }
//                     } else {
//                         alertMessage += `, פרטי שרת: ${JSON.stringify(rtkError.data)}`;
//                     }
//                 }
//                 if (rtkError.error) {
//                     alertMessage += `, שגיאת RTK: ${rtkError.error}`;
//                 }
//                 alertMessage += `)`;
//             } else if (error instanceof Error) {
//                 alertMessage += ` פרטי השגיאה: ${error.message}`;
//             } else if (typeof error === 'string') {
//                 alertMessage += ` פרטי השגיאה: ${error}`;
//             }

//             alert(alertMessage);
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
//                         {(ingredient.itemName || ingredient.name) + ': ' + (ingredient.quantity?.value || 0) + ' ' + (ingredient.quantity?.unit || '')} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${(ingredient.quantity?.value || 0) - availableAmount} ${ingredient.quantity?.unit || ''} במלאי`) : 'לא קיים'}
//                     </Typography>
//                     {!sufficientStock && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleAddtoShoppingList((ingredient.itemName || ingredient.name), (ingredient.quantity?.value || 0), availableAmount)}
//                             disabled={isAddingToShoppingList}
//                         >
//                             {isAddingToShoppingList ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
//                         </Button>
//                     )}
//                 </Box>
//             ))}

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
///////////////////////////
// import React from 'react';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import {
//     selectAllProducts,
//     selectCurrentUserName,
//     updateKitchenItems, // ודא שאתה מייבא את זה
// } from '../users/api/authSlice';
// import { selectSelectedFoodItem } from '../food/foodSlice';
// import { Box, Typography, Button, CircularProgress } from '@mui/material';
// import {
//     useAddShoppingListItemMutation,
//     useUpdateProductQuantityMutation,
//     useGetProductsQuery // ודא שאתה מייבא את זה
// } from '../item/itemApi ';
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// import { updeteShopingliste } from '../users/api/authSlice';
// import Items from './Items';

// // פונקציית עזר לנרמול שמות (אותיות קטנות והסרת רווחים)
// const normalizeName = (name: string): string => {
//     return name.toLowerCase().trim();
// };

// const FoodIngredientsCheck: React.FC = () => {
//     const selectedFood = useAppSelector(selectSelectedFoodItem);
//     const kitchenItems = useAppSelector(selectAllProducts);
//     const currentUserName = useAppSelector(selectCurrentUserName);
//     if(currentUserName==null)
//         return(null)
//     const dispatch = useAppDispatch();

//     const [addShoppingListItem, { isLoading: isAddingToShoppingList }] = useAddShoppingListItemMutation();
//     const [updateProductQuantity, { isLoading: isUpdatingQuantity }] = useUpdateProductQuantityMutation();

//     // **חדש: שימוש ב-useGetProductsQuery כדי שנוכל לבצע refetch**
//      const { data: productsData, refetch: refetchProducts } = useGetProductsQuery(`${currentUserName}`);
       
    


//     if (kitchenItems === null) {
//         return null; // או מחוון טעינה/הודעה מתאים
//     }

//     if (!selectedFood || !selectedFood.name) {
//         return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
//     }

//     const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
//         const ingredientName = ingredient.name || ingredient.itemName;

//         if (!ingredientName) {
//             console.warn("Ingredient missing 'name' or 'itemName' property:", ingredient);
//             return {
//                 ingredient,
//                 exists: false,
//                 sufficientStock: false,
//                 availableAmount: 0,
//             };
//         }

//         const normalizedIngredientName = normalizeName(ingredientName);
//         const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

//         const requiredAmount = ingredient.quantity?.value || 0;
//         const availableAmount = kitchenItem ? kitchenItem.quantity : 0;

//         const hasSufficientStock = kitchenItem && availableAmount >= requiredAmount;

//         return {
//             ingredient,
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
//             const updatePromises = ingredientStatus.map(async (status) => {
//                 const ingredient = status.ingredient;
//                 const ingredientName = ingredient.name || ingredient.itemName;

//                 if (!ingredientName) {
//                     console.error("Cannot process ingredient due to missing name:", ingredient);
//                     throw new Error("Ingredient name is missing for: " + JSON.stringify(ingredient));
//                 }

//                 const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizeName(ingredientName));

//                 if (kitchenItem) {
//                     const newQuantity = kitchenItem.quantity - (ingredient.quantity?.value || 0);

//                     await updateProductQuantity({
//                         userId:kitchenItem._id ,
//                         productName:kitchenItem.name,
//                       //  productId: kitchenItem._id, // **חשוב! העבר את ה-productId הנכון**
//                       //  productId: Items.arguments, // עדכן גם שם אם יש צורך
//                         newQuantity: newQuantity,

//                     }).unwrap();
//                 } else {
//                     console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
//                 }
//             });

//             await Promise.all(updatePromises);

//             // **השינוי העיקרי כאן:**
//             // לאחר שכל העדכונים לשרת בוצעו בהצלחה, בצע refetch לנתוני המטבח
//             const updatedProductsData = await refetchProducts().unwrap();
//             dispatch(updateKitchenItems(updatedProductsData)); // עדכן את ה-Redux store

//             alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו במלאי.`);

//         } catch (error) {
//             console.error('שגיאה מפורטת בעת הכנת המאכל או בעדכון מלאי:', error);

//             let alertMessage = 'אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.';

//             if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
//                 const rtkError = error as { status: number | string; data: any; error?: string };
//                 alertMessage += ` (סטטוס: ${rtkError.status}`;
//                 if (rtkError.data) {
//                     if (typeof rtkError.data === 'object' && rtkError.data.message) {
//                         alertMessage += `, פרטי שרת: ${rtkError.data.message}`;
//                     } else if (typeof rtkError.data === 'string') {
//                         if (rtkError.data.startsWith('<!DOCTYPE html>')) {
//                             alertMessage += `. השרת החזיר HTML, ייתכן שגיאת נתיב API. בדוק את URL: /api/users/${currentUserName}/kitchen-items/{שם_מרכיב}`;
//                         } else {
//                             alertMessage += `, פרטי שרת: ${rtkError.data}`;
//                         }
//                     } else {
//                         alertMessage += `, פרטי שרת: ${JSON.stringify(rtkError.data)}`;
//                     }
//                 }
//                 if (rtkError.error) {
//                     alertMessage += `, שגיאת RTK: ${rtkError.error}`;
//                 }
//                 alertMessage += `)`;
//             } else if (error instanceof Error) {
//                 alertMessage += ` פרטי השגיאה: ${error.message}`;
//             } else if (typeof error === 'string') {
//                 alertMessage += ` פרטי השגיאה: ${error}`;
//             }

//             alert(alertMessage);
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
//                         {(ingredient.name || ingredient.itemName) + ': ' + (ingredient.quantity?.value || 0) + ' ' + (ingredient.quantity?.unit || '')} - {exists ? (sufficientStock ? 'קיים במלאי' : `חסר ${(ingredient.quantity?.value || 0) - availableAmount} ${ingredient.quantity?.unit || ''} במלאי`) : 'לא קיים'}
//                     </Typography>
//                     {!sufficientStock && (
//                         <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleAddtoShoppingList((ingredient.name || ingredient.itemName), (ingredient.quantity?.value || 0), availableAmount)}
//                             disabled={isAddingToShoppingList}
//                         >
//                             {isAddingToShoppingList ? <CircularProgress size={20} /> : 'הוסף לרשימת הקניות'}
//                         </Button>
//                     )}
//                 </Box>
//             ))}

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
    updateKitchenItems,
} from '../users/api/authSlice';
import { selectSelectedFoodItem } from '../food/foodSlice';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import {
    useAddShoppingListItemMutation,
    useUpdateProductQuantityMutation,
    useGetProductsQuery
} from '../item/itemApi '; // ודא שהנתיב מדויק
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
    
    // אם currentUserName הוא null, אנחנו לא יכולים להמשיך
    if (currentUserName === null) {
        return null; // או להציג הודעת שגיאה/טעינה מתאימה
    }
    
    const dispatch = useAppDispatch();

    const [addShoppingListItem, { isLoading: isAddingToShoppingList }] = useAddShoppingListItemMutation();
    const [updateProductQuantity, { isLoading: isUpdatingQuantity }] = useUpdateProductQuantityMutation();

    // שימוש ב-useGetProductsQuery עבור המשתמש הנוכחי
    const { data: productsData, refetch: refetchProducts } = useGetProductsQuery(currentUserName);
       
    // ודא ש-kitchenItems לא null לפני שממשיכים
    if (kitchenItems === null) {
        return <CircularProgress />; // או מחוון טעינה/הודעה מתאים
    }

    if (!selectedFood || !selectedFood.name) {
        return <Typography>לא נבחר מאכל לבדיקת מרכיבים.</Typography>;
    }

    const ingredientStatus = selectedFood.ingredients.map((ingredient) => {
        const ingredientName = ingredient.name || ingredient.itemName;

        if (!ingredientName) {
            console.warn("Ingredient missing 'name' or 'itemName' property:", ingredient);
            return {
                ingredient,
                exists: false,
                sufficientStock: false,
                availableAmount: 0,
            };
        }

        const normalizedIngredientName = normalizeName(ingredientName);
        const kitchenItem = kitchenItems.find(item => normalizeName(item.name) === normalizedIngredientName);

        const requiredAmount = ingredient.quantity?.value || 0;
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

                    // **התיקון כאן:**
                    // מעבירים את `currentUserName` כ-userId ואת `kitchenItem.name` כ-productName.
                    // משתמשים ב-`newQuantity` כדי להתאים לשדה שצפוי ב-API.
                    await updateProductQuantity({
                        userId: currentUserName, // **שימוש ב-currentUserName כ-userId**
                        productName: kitchenItem.name, // **שימוש ב-kitchenItem.name כ-productName**
                        newQuantity: newQuantity, // **התאמה לשדה newQuantity שצפוי ב-API**
                    }).unwrap();
                } else {
                    console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
                }
            });

            await Promise.all(updatePromises);

            // לאחר שכל העדכונים לשרת בוצעו בהצלחה, בצע refetch לנתוני המטבח
            const updatedProductsData = await refetchProducts().unwrap();
            dispatch(updateKitchenItems(updatedProductsData)); // עדכן את ה-Redux store

            alert(`מתחילים להכין את ${selectedFood.name}! הכמויות עודכנו במלאי.`);

        } catch (error) {
            console.error('שגיאה מפורטת בעת הכנת המאכל או בעדכון מלאי:', error);

            let alertMessage = 'אירעה שגיאה בעת הכנת המאכל או בעדכון המלאי.';

            if (error && typeof error === 'object' && 'status' in error && 'data' in error) {
                const rtkError = error as { status: number | string; data: any; error?: string };
                alertMessage += ` (סטטוס: ${rtkError.status}`;
                if (rtkError.data) {
                    if (typeof rtkError.data === 'object' && rtkError.data.message) {
                        alertMessage += `, פרטי שרת: ${rtkError.data.message}`;
                    } else if (typeof rtkError.data === 'string') {
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