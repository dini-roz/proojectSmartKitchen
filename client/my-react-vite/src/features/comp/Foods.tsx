import React from 'react';
import { useGetAllFoodQuery } from "../food/foodApi" 
import { AddFoodFormData } from "../food/types/types";
import { Box, CircularProgress, Typography, Grid, Card, CardContent, CardMedia, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteFoodMutation, useUpdateFoodMutation  } from "../food/foodApi";
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName, updeteKitchenFood, updeteKitchenFoods } from '../users/api/authSlice';
import { string } from 'zod';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';




const Foods: React.FC = () => {
 const foodlist = useAppSelector(updeteKitchenFood);
     const userid = useAppSelector(selectCurrentUserName);
     
      const { data: shopingg, refetch: refetchfood } = useGetAllFoodQuery(`${userid}`);
    // const { data: foods, error, isLoading, refetch } = useGetAllFoodQuery(MOCK_USER_ID);
  const [deleteFood, { isLoading: isDeleting }] = useDeleteFoodMutation();
   const dispatch = useAppDispatch();
  const handleDeleteFood = async (foodId: string) => {
     if (!userid) {
            alert('משתמש לא מזוהה, לא ניתן למחוק פריט.');
            return;
        }
    try {
  //    await deleteFood({ userid: userid, itemId: foodId }).unwrap();
      await deleteFood({ userId: userid, foodId: foodId }).unwrap();
      alert('המאכל נמחק בהצלחה!');
        const updatedShoppingData = await refetchfood().unwrap();
                    // dispatch(useUpdateFoodMutation(updatedShoppingData)); 
                  
                    dispatch(updeteKitchenFoods(updatedShoppingData))
    } catch (err) {
      console.error('שגיאה במחיקת מאכל:', err);
      alert('שגיאה במחיקת מאכל.');
    }
  };



  if (!foodlist || foodlist.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">אין מאכלים להצגה במטבח כרגע.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
        המאכלים שלי במטבח החכם
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {foodlist.map((food) => (
          <Grid  key={food._id}>
            <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '15px', 
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)', 
                }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={food.imageUrl || ''} 
                alt={food.name}
                sx={{ objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#424242' }}>
                        {food.name}
                    </Typography>
                    <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDeleteFood(food._id)} 
                        disabled={isDeleting}
                        sx={{ color: '#f44336' }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                  **רכיבים:**
                </Typography>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {food.ingredients && food.ingredients.map((ing: any, index: number) => (
                    <li key={index}>
                      <Typography variant="body2" color="text.primary">
                        {ing.itemName}: {ing.quantity.value} {ing.quantity.unit}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Foods;

