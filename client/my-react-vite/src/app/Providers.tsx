
  import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store'; 
import { RouterProvider } from 'react-router';
import router from "../routes/AppRouter";
import { PersistGate } from 'redux-persist/integration/react'; 

const Providers = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
};

export default Providers;