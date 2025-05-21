import { Link, useNavigate, useParams } from 'react-router';
import {Grid} from "@mui/material"
import { Navigate } from 'react-router';
import AddItemUser from '../item/AddItemUser';
const HomePage: React.FC = () => {
  const { homePageid } = useParams<{ homePageid: string }>();
    //  const navigate = useNavigate();
    //      {navigate("/AddItemUser") }
  // Now you can use the homePageid to fetch user data, etc.
  return (
 <>
  <h1>Welcome to HomePage of user {homePageid}</h1>
      <AddItemUser></AddItemUser>
 </>
     

        )

      }
export default HomePage