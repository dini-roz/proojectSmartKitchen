// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IngredientFormData } from '../food/types/types';



// interface addFoodState {
//     name: string | null;
//     imageUrl: string | null;
//     ingredients: IngredientFormData[] ;
// }

// const initialState: addFoodState = {
//     name: null,
//     imageUrl: null,
//     ingredients: [] 
// };

// const selectedFoodSlice = createSlice({
//     name: 'selectedFood',
//     initialState,
//     reducers: {
//         setSelectedFood: (
//             state,
//             action: PayloadAction<{
//                 name: string; imageUrl: string; ingredients: IngredientFormData[]
//             }>
//         ) => {
//             state.name = action.payload.name
//             state.imageUrl = action.payload.imageUrl
//             state.ingredients = action.payload.ingredients
       
//         },

//         eposeSelectedFood: (state) => {
//             state.name = null
//             state.imageUrl = null
//             state.ingredients = []
//         },
//     },
// });

// export const { setSelectedFood, eposeSelectedFood } = selectedFoodSlice.actions;

// export default selectedFoodSlice.reducer


// src/features/comp/selectedFood.ts (or .tsx)

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// // Define the type for a single ingredient in your form data
// export interface IngredientFormData {
//   itemName: string;
//   quantity: {
//     value: number;
//     unit: string;
//   };
// }

// // Define the state interface for the selected food slice
// interface SelectedFoodState { // Renamed from addFoodState for clarity in this context
//   name: string | null;
//   imageUrl: string | null;
//   ingredients: IngredientFormData[];
// }

// const initialState: SelectedFoodState = {
//   name: null,
//   imageUrl: null,
//   ingredients: [],
// };

// const selectedFoodSlice = createSlice({
//   name: 'selectedFood',
//   initialState,
//   reducers: {
//     setSelectedFood: (
//       state,
//       action: PayloadAction<{
//         name: string; imageUrl: string; ingredients: IngredientFormData[]
//       }>
//     ) => {
//       state.name = action.payload.name;
//       state.imageUrl = action.payload.imageUrl;
//       state.ingredients = action.payload.ingredients;
//     },
//     // Typo corrected: "eposeSelectedFood" changed to "resetSelectedFood" for better readability
//     resetSelectedFood: (state) => {
//       state.name = null;
//       state.imageUrl = null;
//       state.ingredients = [];
//     },
//   },
// });

// export const { setSelectedFood, resetSelectedFood } = selectedFoodSlice.actions;

// export default selectedFoodSlice.reducer;
// export const selectfooditem = (state: { auth: SelectedFoodState }) => state.auth.ingredients
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientFormData, FoodItem } from '../food/types/types'; // Import from shared types

interface SelectedFoodState {
  name: string | null;
  imageUrl: string | null;
  ingredients: IngredientFormData[];
}

const initialState: SelectedFoodState = {
  name: null,
  imageUrl: null,
  ingredients: [],
};

const selectedFoodSlice = createSlice({
  name: 'selectedFood',
  initialState,
  reducers: {
    setSelectedFood: (
      state,
      action: PayloadAction<FoodItem> // Use the FoodItem interface directly
    ) => {
      state.name = action.payload.name;
      state.imageUrl = action.payload.imageUrl;
      state.ingredients = action.payload.ingredients;
    },
    resetSelectedFood: (state) => {
      state.name = null;
      state.imageUrl = null;
      state.ingredients = [];
    },
  },
});

export const { setSelectedFood, resetSelectedFood } = selectedFoodSlice.actions;

export default selectedFoodSlice.reducer;

// Corrected selector
import { RootState } from '../../app/store'; // Make sure this path is correct for your RootState

export const selectSelectedFoodItem = (state: RootState) => state.selectedFood;