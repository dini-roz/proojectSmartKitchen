import { createBrowserRouter } from "react-router";
import LandingPage from "../comp/LandingPage"
import Signup from "../features/users/components/Signup"
import Login from "../features/users/components/Login"
import UserAppLayout from "../common/UserAppLayout"
import HomePage from "../features/comp/HomePage";
import AddItemUser from "../features/item/AddItemUser"
import { Children } from "react";
const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "signup", element: <Signup /> }, 
    { path: "login", element: <Login /> }, 
     {
        // element: <UserAppLayout/>, // רכיב מגן שישמש ליתר הניתובים רק לאחר הרשמה/כניסה
        // children: [
        //     { path:":homePageid", element: <HomePage />,
              

        //      } // דף הבית
             
        // ],
         element: <UserAppLayout/>, // רכיב מגן שישמש ליתר הניתובים רק לאחר הרשמה/כניסה
      children: [
        { path:":homePageid", element: <HomePage /> }, // דף הבית
        { path:":homePageid/add-item", element: <AddItemUser /> }, // נתיב להוספת מוצר
      ],
  
     },


]);

export default router;
