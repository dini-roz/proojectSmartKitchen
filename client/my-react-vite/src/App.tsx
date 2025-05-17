
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // ייבא BrowserRouter
import { Provider } from 'react-redux';
import { store } from './app/store';
import Signup from './features/users/components/Signup'; // או כל קומפוננטה אחרת שמשתמשת ב-Link
import LandingPage from './comp/LandingPage';

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter> {/* עטוף את התוכן שלך ב-BrowserRouter */}
          <Routes>
        <Route path="/" element={<LandingPage />} /> {/* דף הנחיתה כעמוד הבית */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/signup" element={<Signup />} />
        {/* ... שאר ה-Routes שלך ... */}
      </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;

 

 

