import { Button }from '@mui/material'
import { Link } from "react-router";

const Header = () => {
  return (
   
    <>
     <Button component={Link} to="/food">
    מאכלים
  </Button>
  <Button  component={Link} to="/items">
    מוצרים
  </Button>
      <Button  component={Link} to="/shoppingList">
      רשימת קניות
    </Button>    
    <Button  component={Link} to="/homePageid">
    דף הבית
    </Button>   
    </> 
  );
};

export default Header;
