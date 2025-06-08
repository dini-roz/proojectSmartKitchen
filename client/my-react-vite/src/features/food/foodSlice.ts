import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientFormData } from '../food/types/types';

interface addFoodState {
    name: string | null;
    imageUrl: string | null;
    ingredients: IngredientFormData[] ;
}

const initialState: addFoodState = {
    name: null,
    imageUrl: null,
    ingredients: [] 
};

const foodSlice = createSlice({
    name: 'addFood',
    initialState,
    reducers: {
        setFood: (
            state,
            action: PayloadAction<{
                name: string; imageUrl: string; ingredients: IngredientFormData[]
            }>
        ) => {
            state.name = action.payload.name
            state.imageUrl = action.payload.imageUrl
            state.ingredients = action.payload.ingredients
       
        },

        epose: (state) => {
            state.name = null
            state.imageUrl = null
            state.ingredients = []
        },
    },
});

export const { setFood, epose } = foodSlice.actions;

export default foodSlice.reducer
import { RootState } from '../../app/store'; 

export const selectSelectedFoodItem = (state: RootState) => state.selectedFood;

