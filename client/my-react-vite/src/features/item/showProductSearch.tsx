
// import React, { useState, useCallback } from 'react';
// import { TextField, List, ListItem, Typography, Box, Button } from '@mui/material';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// // ייבוא ה"סלקטור" המעודכן (אם בחרתם לשנות את שמו)
// import { updeteKitchenFood } from '../users/api/authSlice'; // ודאו שהנתיב נכון
// // ייבוא פעולות מה"פרוסה" של המתכון הנבחר
// import { setSelectedFood, resetSelectedFood } from "../comp/selectedFood" // ודאו שהנתיב נכון
// // ייבוא FoodItem מקובץ הטיפוסים המשותף
// import { FoodItem } from "../food/types/types"; // ודאו שהנתיב נכון
// //import { Navigate, useNavigate } from 'react-router';
// import FoodAvailabilityChecker from '../comp/FoodAvailabilityChecker';

// const ProductSearch: React.FC = () => {
//   // השתמשו ב"סלקטור" המעודכן
//   const allFoods = useAppSelector(updeteKitchenFood) as FoodItem[] | null;
//   const dispatch = useAppDispatch();
//   //const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

//   // קבלו את המתכון הנבחר מהסטייט הגלובלי כדי להציג אותו (אופציונלי ברכיב זה)
//   // השתמשו ב"סלקטור" הספציפי מ-selectedFoodSlice אם זמין, או גשו ישירות
//   const globalSelectedFood = useAppSelector((state) => state.selectedFood);

//   const findSimilarFoods = useCallback(
//     (term: string): FoodItem[] => {
//       if (!term || !allFoods) {
//         return [];
//       }
//       const lowerTerm = term.toLowerCase();
//       return allFoods
//         .filter((food) => food?.name?.toLowerCase().includes(lowerTerm))
//         .sort((a, b) => {
//           const aLowerName = a?.name?.toLowerCase() || '';
//           const bLowerName = b?.name?.toLowerCase() || '';
//           const aStartsWith = aLowerName.startsWith(lowerTerm);
//           const bStartsWith = bLowerName.startsWith(lowerTerm);

//           if (aStartsWith && !bStartsWith) return -1;
//           if (!aStartsWith && bStartsWith) return 1;

//           const aIndex = aLowerName.indexOf(lowerTerm);
//           const bIndex = bLowerName.indexOf(lowerTerm);

//           if (aIndex === bIndex) {
//             return aLowerName.localeCompare(bLowerName);
//           }
//           return aIndex - bIndex;
//         });
//     },
//     [allFoods]
//   );

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newSearchTerm = event.target.value;
//     setSearchTerm(newSearchTerm);
//     const results = findSimilarFoods(newSearchTerm);
//     setSearchResults(results);
//     // כאשר מונח החיפוש משתנה, אפסו את המתכון שנבחר בסטייט הגלובלי
//     dispatch(resetSelectedFood());
//     console.log("hgfhf"),
//       <FoodAvailabilityChecker></FoodAvailabilityChecker>
//   };

//   const handleSelectFood = () => {
//     if (searchResults.length > 0) {
//       const selectedFoodObject = searchResults[0]; // קבלו את אובייקט המתכון המלא
//       console.log('Food object sent to global state:', selectedFoodObject);

//       // שלחו את הפעולה לשמירת האובייקט המלא בסטייט הגלובלי
//       dispatch(setSelectedFood(selectedFoodObject));

//       alert(`המתכון נבחר: ${selectedFoodObject.name}\nהאובייקט המלא נשמר בסטייט הגלובלי.`);
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
//       <Typography variant="h6" gutterBottom>חיפוש מתכונים</Typography>
//       <TextField
//         label="חפש מתכון"
//         value={searchTerm}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//       />
//       {searchTerm && searchResults.length > 0 && (
//         <>
//           <List sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', mt: 1 }}>
//             {searchResults.map((food) => (
//               <ListItem key={food._id} divider>
//                 <Box>
//                   <Typography variant="body1">
//                     **שם:** {food.name}
//                   </Typography>
//                   {food.ingredients && food.ingredients.length > 0 && (
//                     <Typography variant="body2" color="text.secondary">
//                       **מרכיבים:**
//                       <List dense sx={{ ml: 1, my: 0.5 }}>
//                         {food.ingredients.map((ing: { itemName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantity: { value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; unit: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; }, idx: React.Key | null | undefined) => (
//                           <ListItem key={idx} sx={{ py: 0, px: 0 }}>
//                             <Typography variant="caption">
//                               {ing.itemName}: {ing.quantity?.value} {ing.quantity?.unit}
//                             </Typography>
//                           </ListItem>
//                         ))}
//                       </List>
//                     </Typography>
//                   )}
//                 </Box>
//               </ListItem>
//             ))}
//           </List>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSelectFood}
//             sx={{ mt: 2, width: '100%' }}
//           >
//             בחר מתכון
//           </Button>
//         </>
//       )}

//       {/* הצגת המתכון הנבחר מהסטייט הגלובלי בתוך רכיב זה (אופציונלי) */}
//       {globalSelectedFood.name && (
//         <Box sx={{ mt: 3, p: 2, border: '1px dashed #007bff', borderRadius: '8px' }}>
//           <Typography variant="h6">המתכון הנבחר (סטייט גלובלי):</Typography>
//           <Typography variant="body1">**שם:** {globalSelectedFood.name}</Typography>
//           {globalSelectedFood.imageUrl && (
//             <img src={globalSelectedFood.imageUrl} alt={globalSelectedFood.name} style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '8px' }} />
//           )}
//           {globalSelectedFood.ingredients && globalSelectedFood.ingredients.length > 0 && (
//             <Typography variant="body2" color="text.secondary">
//               **מרכיבים:**
//               <List dense sx={{ ml: 1, my: 0.5 }}>
//                 {globalSelectedFood.ingredients.map((ing, idx) => (
//                   <ListItem key={idx} sx={{ py: 0, px: 0 }}>
//                     <Typography variant="caption">
//                       {ing.itemName}: {ing.quantity?.value} {ing.quantity?.unit}
//                     </Typography>
//                   </ListItem>
//                 ))}
//               </List>
//             </Typography>
//           )}
//         </Box>
//       )}

//       {searchTerm && searchResults.length === 0 && (
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//           לא נמצאו מתכונים תואמים לחיפוש שלך.
//         </Typography>
//       )}
//       {!searchTerm && (
//         <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//           הזן שם מתכון כדי להתחיל בחיפוש.
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default ProductSearch;
import React, { useState, useCallback } from 'react';
import { TextField, List, ListItem, Typography, Box, Button } from '@mui/material';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';
import { updeteKitchenFood } from '../users/api/authSlice'; // Ensure correct path for your kitchen items selector
import { setSelectedFood, resetSelectedFood } from "../comp/selectedFood"; // Ensure correct path for selected food actions
import { FoodItem } from "../food/types/types"; // Ensure correct path for FoodItem type
import FoodIngredientsCheck from "../comp/FoodAvailabilityChecker"; // Import the FoodIngredientsCheck component

const ProductSearch: React.FC = () => {
  const allFoods = useAppSelector(updeteKitchenFood) as FoodItem[] | null;
  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  // Local state to control visibility of FoodIngredientsCheck
  const [showFoodChecker, setShowFoodChecker] = useState(false); 

  // Get the globally selected food item from the Redux store
  // Assuming 'selectedFood' is the slice name in your RootState
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
    // When search term changes, reset the selected recipe in global state
    dispatch(resetSelectedFood());
    // Hide the checker when the search term changes
    setShowFoodChecker(false); 
  };

  const handleSelectFood = () => {
    if (searchResults.length > 0) {
      const selectedFoodObject = searchResults[0]; // Get the full recipe object
      console.log('Food object sent to global state:', selectedFoodObject);

      // Dispatch the action to save the full object to the global state
      dispatch(setSelectedFood(selectedFoodObject));

      // After selecting a food, show the FoodIngredientsCheck component
      setShowFoodChecker(true); 

      // You might want to remove the alert in a real app
      // alert(`המתכון נבחר: ${selectedFoodObject.name}\nהאובייקט המלא נשמר בסטייט הגלובלי.`);
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
                        {/* Ensure correct type for ing.quantity.value and ing.quantity.unit */}
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

      {/* Conditionally render FoodIngredientsCheck based on showFoodChecker state */}
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