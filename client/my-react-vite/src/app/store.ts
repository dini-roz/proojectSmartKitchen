// import { persistStore, persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";

// import { api } from "./api" 
// import itemFormReducer from '../features/item/itemFormSlice'; 
// import authSlice from "../features/users/api/authSlice";

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'] 
// };
// export const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//     itemForm: itemFormReducer, 
//     auth:authSlice
//   },

 
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// });

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

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