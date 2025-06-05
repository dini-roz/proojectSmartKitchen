// import { PayloadAction, createSlice } from "@reduxjs/toolkit"
// import { RootState } from "../../app/store";


// interface foodFormState{
//     isFormsubmitted:boolean,
//     submissionError:string | null
// }

// const initialState : foodFormState ={
//     isFormsubmitted: false,
//     submissionError :null
// }
// export const foodFormSlice = createSlice({
//     name: 'foodForm',
//     initialState,
//     reducers: {
//       setFormSubmission: (state,action:PayloadAction<boolean>) => {
//         state.isFormsubmitted=action.payload;
//       },
//       setSubmissionError: (state, action:PayloadAction<string>) => {
//         state.submissionError=action.payload;
//       },
//       resetFormstate: (state) => {
//         state.isFormsubmitted=false;
//         state.submissionError=null;
//       },
//     },
//   });
// export const{ setFormSubmission , setSubmissionError , resetFormstate}=foodFormSlice.actions;
// export const selectIsFoodFormSubmitted = (state:RootState) => state.foodForm.isFormsubmitted;
// export const selectFoodSubmissionError = (state:RootState) =>state.foodForm.submissionError;
// export default foodFormSlice.reducer
