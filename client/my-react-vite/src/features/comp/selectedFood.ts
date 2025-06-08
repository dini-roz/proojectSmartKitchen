
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientFormData, FoodItem } from '../food/types/types'; 
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
      action: PayloadAction<FoodItem> 
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


import { RootState } from '../../app/store'; 

export const selectSelectedFoodItem = (state: RootState) => state.selectedFood;