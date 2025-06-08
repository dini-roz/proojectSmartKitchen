
import React, { useState, useCallback } from 'react';
import { TextField, List, ListItem, Typography, Box, Button } from '@mui/material';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';
import { updeteKitchenFood } from '../users/api/authSlice'; 
import { setSelectedFood, resetSelectedFood } from "../comp/selectedFood"; 
import { FoodItem } from "../food/types/types"; 
import FoodIngredientsCheck from "../comp/FoodAvailabilityChecker";

const ProductSearch: React.FC = () => {
  const allFoods = useAppSelector(updeteKitchenFood) as FoodItem[] | null;
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

  const [showFoodChecker, setShowFoodChecker] = useState(false); 

 
  const globalSelectedFood = useAppSelector((state) => state.selectedFood);

  const findSimilarFoods = useCallback(
    (term: string): FoodItem[] => {
      if (!term || !allFoods) {
        return [];
      }
      const lowerTerm = term.toLowerCase();
      return allFoods
        .filter((food) => food?.name?.toLowerCase().includes(lowerTerm))
        .sort((a, b) => {
          const aLowerName = a?.name?.toLowerCase() || '';
          const bLowerName = b?.name?.toLowerCase() || '';
          const aStartsWith = aLowerName.startsWith(lowerTerm);
          const bStartsWith = bLowerName.startsWith(lowerTerm);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          const aIndex = aLowerName.indexOf(lowerTerm);
          const bIndex = bLowerName.indexOf(lowerTerm);

          if (aIndex === bIndex) {
            return aLowerName.localeCompare(bLowerName);
          }
          return aIndex - bIndex;
        });
    },
    [allFoods]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    const results = findSimilarFoods(newSearchTerm);
    setSearchResults(results);
  
    dispatch(resetSelectedFood());
   
    setShowFoodChecker(false); 
  };

  const handleSelectFood = () => {
    if (searchResults.length > 0) {
      const selectedFoodObject = searchResults[0]; 
      console.log('Food object sent to global state:', selectedFoodObject);


      dispatch(setSelectedFood(selectedFoodObject));

    
      setShowFoodChecker(true); 

      
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" gutterBottom>חיפוש מתכונים</Typography>
      <TextField
        label="חפש מתכון"
        value={searchTerm}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      {searchTerm && searchResults.length > 0 && (
        <>
          <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', mt: 1 }}>
            {searchResults.map((food) => (
              <ListItem key={food._id} divider>
                <Box>
                  <Typography variant="body1">
                    **שם:** {food.name}
                  </Typography>
                  {food.ingredients && food.ingredients.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      **מרכיבים:**
                      <List dense sx={{ ml: 1, my: 0.5 }}>
                   
                        {food.ingredients.map((ing, idx) => ( 
                          <ListItem key={idx} sx={{ py: 0, px: 0 }}>
                            <Typography variant="caption">
                              {ing.itemName}: {ing.quantity?.value} {ing.quantity?.unit}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSelectFood}
            sx={{ mt: 2, width: '100%' }}
          >
            בחר מתכון
          </Button>
        </>
      )}

    
      {showFoodChecker && globalSelectedFood.name && (
        <Box sx={{ mt: 3, p: 2, border: '1px dashed #007bff', borderRadius: '8px' }}>
          <FoodIngredientsCheck />
        </Box>
      )}

      {searchTerm && searchResults.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          לא נמצאו מתכונים תואמים לחיפוש שלך.
        </Typography>
      )}
      {!searchTerm && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          הזן שם מתכון כדי להתחיל בחיפוש.
        </Typography>
      )}
    </Box>
  );
};

export default ProductSearch;