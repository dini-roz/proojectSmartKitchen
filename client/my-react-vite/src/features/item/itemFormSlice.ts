import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store'; 

interface ItemFormState {
  isFormSubmitted: boolean;
  submissionError: string | null;
}

const initialState: ItemFormState = {
  isFormSubmitted: false,
  submissionError: null,
};

export const itemFormSlice = createSlice({
  name: 'itemForm',
  initialState,
  reducers: {
    setFormSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isFormSubmitted = action.payload;
    },
    setSubmissionError: (state, action: PayloadAction<string | null>) => {
      state.submissionError = action.payload;
    },
    resetFormState: (state) => {
      state.isFormSubmitted = false;
      state.submissionError = null;
    },
  },
});

export const { setFormSubmitting, setSubmissionError, resetFormState } = itemFormSlice.actions;

export const selectIsFormSubmitted = (state: RootState) => state.itemForm.isFormSubmitted;
export const selectSubmissionError = (state: RootState) => state.itemForm.submissionError;

export default itemFormSlice.reducer;