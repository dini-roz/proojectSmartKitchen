import { Link, useNavigate, useParams } from 'react-router';
import { useState} from "react"
import {Grid} from "@mui/material"
import { Navigate } from 'react-router';
import AddItemUser from '../item/AddItemUser';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName } from '../users/api/authSlice';
const HomePage: React.FC = () => {
 // const { homePageid } = useParams<{ homePageid: string }>();
  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const [showAddFood,setShowAddFood]=useState<boolean>(false);
  const [showShopingList,setShowShopingList]=useState<boolean>(false);
    const homePageid = useAppSelector(selectCurrentUserName);
  return (
 <>

  <h1>Welcome to HomePage of user {homePageid}</h1>
 
  <div>
      {!showAddItem && <button onClick={()=>setShowAddItem(true)}>הוספת מוצר</button>}
      {showAddItem && <AddItemUser />}
    </div>
    <div>
      {!showAddFood && <button onClick={()=>setShowAddFood(true)}>הוספת מאכל</button>}
      { showAddFood&& <AddItemUser />}
    </div>
    <div>
      {!showShopingList && <button onClick={()=>setShowShopingList(true)}>הוספת מוצר לרשימת קניות</button>}
      {showShopingList && <AddItemUser />}
    </div>
 </>
 
     

        )

      }
export default HomePage