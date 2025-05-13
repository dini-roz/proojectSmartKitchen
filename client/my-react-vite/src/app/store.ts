import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "../features/users/api/userApi";

export const store = configureStore({
  reducer: {
   // userApi: userApi,
   // products: productsReducer, // הוספת ה-reducer של products כאן
    [userApi.reducerPath]: userApi.reducer,
  //  [productsApi.reducerPath]: productsApi.reducer, // הוספת ה-API של products כאן
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware) //productsApi.middleware), // הוספת ה-middleware של products
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
