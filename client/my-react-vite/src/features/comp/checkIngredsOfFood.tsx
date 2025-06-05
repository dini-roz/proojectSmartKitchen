// import React from 'react';


// //import { ingredient } from './food/types/types';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import { Card, CardContent, Typography, List, ListItem, ListItemText } from '@mui/material';
// import { CombinedState } from '@reduxjs/toolkit/query';
// import { PersistPartial } from 'redux-persist/es/persistReducer';

// const FoodDetail: React.FC = () => {
//     // const selectedFood = useSelector((state: RootState) => state.selectedFood);
//     const selectedFood = useAppSelector(selectedFoodSlice());
//     let contact;
//     if (!selectedFood) {
//         contact = <div>לא נבחר מאכל</div>
//     }
//     else {
//         if (!selectedFood) {
//             return <div>לא נבחר מאכל</div>;
//         }
//         contact = <Card>
//             <CardContent>
//                 <Typography variant="h5" component="div">
//                     {selectedFood.name}
//                 </Typography>
//                 {selectedFood.imageUrl && <img src={selectedFood.imageUrl} alt={selectedFood.name} style={{ width: '100%', height: 'auto' }} />}
//                 <Typography variant="h6" component="div">
//                     מרכיבים:
//                 </Typography>
//                 <List>
//                     {selectedFood.ingredients.map((ingredient: ingredient, index: number) => (
//                         <ListItem key={index}>
//                             <ListItemText primary={ingredient.name} secondary={`כמות: ${ingredient.quantity}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </CardContent>
//         </Card>
//     }


//     return (
//         contact
//     );
// };

// export default FoodDetail;
// function selectedFoodSlice(state: { api: CombinedState<{}, 'User' | 'Item' | 'Food', 'api'>; itemForm: ItemFormState; foodForm: foodFormState; auth: AuthState; } & PersistPartial): unknown {
//     throw new Error('Function not implemented.');
// }

