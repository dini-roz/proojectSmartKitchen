
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
} from '../item/itemApi ';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';
import { updeteShopingliste } from '../users/api/authSlice';


const normalizeName = (name: string): string => {
    return name.toLowerCase().trim();
};

const FoodIngredientsCheck: React.FC = () => {
    const selectedFood = useAppSelector(selectSelectedFoodItem);
    const kitchenItems = useAppSelector(selectAllProducts);
    const currentUserName = useAppSelector(selectCurrentUserName);
    
  
    if (currentUserName === null) {
        return null; 
    }
    
    const dispatch = useAppDispatch();

    const [addShoppingListItem, { isLoading: isAddingToShoppingList }] = useAddShoppingListItemMutation();
    const [updateProductQuantity, { isLoading: isUpdatingQuantity }] = useUpdateProductQuantityMutation();

   
    const { data: productsData, refetch: refetchProducts } = useGetProductsQuery(currentUserName);
       
   
    if (kitchenItems === null) {
        // return <CircularProgress />; 
        return null
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

                    await updateProductQuantity({
                        userId: currentUserName, 
                        productName: kitchenItem.name, 
                        newQuantity: newQuantity,
                    }).unwrap();
                } else {
                    console.warn(`Kitchen item '${ingredientName}' not found in kitchen, even though it was checked before. Skipping update.`);
                }
            });

            await Promise.all(updatePromises);

        
            const updatedProductsData = await refetchProducts().unwrap();
            dispatch(updateKitchenItems(updatedProductsData)); 

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