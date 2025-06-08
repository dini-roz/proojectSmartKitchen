
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from '../features/users/api/authSlice'; 
import selectedFoodReducer from '../features/comp/selectedFood';
import { api } from "./api";
import itemFormReducer from '../features/item/itemFormSlice';
import authSlice from "../features/users/api/authSlice";
 
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] 
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  itemForm: itemFormReducer,
  auth: authSlice,
   selectedFood: selectedFoodReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;