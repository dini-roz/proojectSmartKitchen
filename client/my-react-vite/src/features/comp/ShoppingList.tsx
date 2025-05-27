import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector } from "../../app/hooks/useAppSelector";
import { selectCurrentUserId, selectCurrentUserName, setCredentials } from "../users/api/authSlice";
import { useNavigate } from "react-router";
 import { logout } from "../users/api/authSlice";
import { useAppDispatch } from "../../app/hooks/useAppDispatch";

const ShoppingList: React.FC = () => {
  //    const username = useSelector((state: RootState) => state.auth.userName);
  // const userId = useSelector((state: RootState) => state.auth.userId);
   const navigate = useNavigate();
   const formModee = useAppSelector(selectCurrentUserName);
        
     const dispatch = useAppDispatch();
      console.log(formModee)
    const hndelsumbite = () => {

      
      console.log(formModee)
      dispatch(logout());
           
      console.log(formModee)
   navigate("/login")
  };

    return(
        <>
                   <h1>hloew </h1>
   
        <h1>hello shopping list</h1>
               <button onClick={hndelsumbite}>ggggg</button>

        </>
        )
}
 export default   ShoppingList


  

