// import { Provider } from 'react-redux';
// import {store} from './store'
// import {RouterProvider} from 'react-router'
// import router from "../routes/AppRouter"
// const Providers = () => {
//   return (
//    <>
//     <Provider store={store}>
//     <RouterProvider router={router} />
//     </Provider>
//    </>
//     )
//   };
  
//   export default Providers;
  import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store'; // ייבא גם את persistor
import { RouterProvider } from 'react-router';
import router from "../routes/AppRouter";
import { PersistGate } from 'redux-persist/integration/react'; // ייבא את PersistGate

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