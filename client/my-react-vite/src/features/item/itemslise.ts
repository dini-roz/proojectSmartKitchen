import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface additemState {
    name:string |null;
    category :string|null
    count :string|null
    urlimeg:string|null
  
 


}

const initialState: additemState = {
    name: null,
    category: null,
    count: null,
    urlimeg: null
 
};

const itemSlice = createSlice({
  name: 'additem',
  initialState,
  reducers: {
   
    setitem: (
      state,
     action: PayloadAction<{ 
        name :string; category :string ; count:string; urlimeg:string
       }>
    ) => {
      state.name=action.payload.name
        state.category=action.payload.category
          state.count=action.payload.count
            state.urlimeg=action.payload.urlimeg
    },
   
    epose: (state) => {
  state.name=null
        state.category=null
          state.count=null
            state.urlimeg=null
    },
  },
});

export const { setitem, epose } = itemSlice.actions;

export default  itemSlice.reducer


