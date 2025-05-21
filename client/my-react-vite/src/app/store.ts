// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import { userApi } from "../features/users/api/userApi";
// import { itemApi } from "../features/item/itemApi ";
// export const store = configureStore({
//   reducer: {
//    // userApi: userApi,
//    // products: productsReducer, // הוספת ה-reducer של products כאן
//     [userApi.reducerPath]: userApi.reducer,
//     //[itemApi.reducerPath]:itemApi.reducer,
//   //  [productsApi.reducerPath]: productsApi.reducer, // הוספת ה-API של products כאן
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(userApi.middleware),

// });

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { api } from "./api" 
import itemFormReducer from '../features/item/itemFormSlice'; // ייבוא ה-reducer החדש

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    itemForm: itemFormReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
