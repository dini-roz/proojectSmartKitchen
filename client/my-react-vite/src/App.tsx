// import { useState } from 'react'

// import './App.css'
// import Login from './comp/Login'
// import { BrowserRouter } from 'react-router';
// import Signup from './comp/Signup'
// import { QueryClient } from '@tanstack/react-query';
// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from './app/store';

// function App() {
// const queryClient=new QueryClient();

//   return (
//    <>
//        <Provider store={store}>
//     <Signup />
//   </Provider>,
//    </>


  


  
//   )  
// }
import React from 'react';
import { BrowserRouter } from 'react-router-dom'; // ייבא BrowserRouter
import { Provider } from 'react-redux';
import { store } from './app/store';
import Signup from './features/users/components/Signup'; // או כל קומפוננטה אחרת שמשתמשת ב-Link

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter> {/* עטוף את התוכן שלך ב-BrowserRouter */}
          <Signup /> {/* או כל קומפוננטה אחרת שמשתמשת ב-Link */}
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

 

 

