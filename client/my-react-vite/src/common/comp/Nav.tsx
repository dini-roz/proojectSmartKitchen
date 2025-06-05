// import React from 'react';
// import { Button, AppBar, Toolbar, IconButton, Avatar, Box } from '@mui/material';
// import { Link } from 'react-router';
// import KitchenIcon from '@mui/icons-material/Kitchen';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// const Header = () => {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="fixed" sx={{
//         backgroundColor: '#2e7d32',
//         boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
//         width: '100%',
//       }}>
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem' }}>
            
//           <Box sx={{ display: 'flex', justifyContent: 'space-around', flexGrow: 1 }}> 
//             <Button component={Link} to="/food" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', mr: 1 }}>
//               <RestaurantMenuIcon sx={{ mr: 1 }} /> מאכלים
//             </Button>
//             <Button component={Link} to="/items" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', mr: 1 }}>
//              <InventoryIcon sx={{ mr: 1, color:"inherit" }}   /> מוצרים
//             </Button>
//            <Button component={Link} to="/shoppingList" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', '&:hover': { backgroundColor: "hoverBackgroundColor "} }}>
//            <ShoppingCartIcon sx={{ mr: 1, color: "textColor" }} />
//           <span style={{ color: "i" }}>רשימת קניות</span>
//        </Button>
// <Button component={Link} to="/homePageid" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', '&:hover': { backgroundColor: "hoverBackgroundColor" } }}>
//      <KitchenIcon sx={{ fontSize: 30 }} />
//   <span style={{ color: "textColor" }}> המטבח שלי</span>

// </Button>
//           </Box>
//                  <IconButton color="inherit">
//             <Avatar sx={{ bgcolor: '#f57c00' }}>
//               <AccountCircle sx={{ fontSize: 30, color: 'white' }} />
//             </Avatar>
//           </IconButton>
//         </Toolbar>
//       </AppBar>
//       <Toolbar /> 
//     </Box>
//   );
// };

// export default Header;

import React from 'react';
import { Button, AppBar, Toolbar, IconButton, Avatar, Box } from '@mui/material';
import { Link } from 'react-router';
import KitchenIcon from '@mui/icons-material/Kitchen'; 
import InventoryIcon from '@mui/icons-material/Inventory'; 
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import { useAppSelector } from '../../app/hooks/useAppSelector'; 
import { selectCurrentUserName, selectUserProfilePicture } from '../../features/users/api/authSlice'; 


const getAvatarStyle = (username: string | null) => {
  if (!username) {
    return { backgroundColor: 'gray' }; 
  }
  const firstLetter = username.charCodeAt(0);
  const hue = firstLetter * 15 % 360; 
  return {
    backgroundColor: `hsl(${hue}, 70%, 50%)`, 
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
};

const Header = () => {
  
  const currentUser = useAppSelector(selectCurrentUserName);
  const profilePicture = useAppSelector(selectUserProfilePicture);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ 
        backgroundColor: '#2e7d32', 
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)', // צל
        width: '100%',
      }}>
        <Toolbar sx={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          padding: '0 1rem',
        }}>

         
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexGrow: 1 }}>
            <Button component={Link} to="/foods" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', mr: 1 }}>
              <RestaurantMenuIcon sx={{ mr: 1 }} /> מאכלים
            </Button>
            <Button component={Link} to="/items" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', mr: 1 }}>
              <InventoryIcon sx={{ mr: 1, color: "inherit" }} /> מוצרים
            </Button>
            <Button component={Link} to="/shoppingList" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', '&:hover': { backgroundColor: "hoverBackgroundColor "} }}>
              <ShoppingCartIcon sx={{ mr: 1, color: "textColor" }} />
              <span style={{ color: "i" }}>רשימת קניות</span>
            </Button>
            <Button component={Link} to="/homePageid" color="inherit" sx={{ fontWeight: 'bold', flexGrow: 1, justifyContent: 'center', '&:hover': { backgroundColor: "hoverBackgroundColor" } }}>
              <KitchenIcon sx={{ fontSize: 30 }} />
              <span style={{ color: "textColor" }}> המטבח שלי</span>
            </Button>
          </Box>

      
          <IconButton color="inherit">
            {profilePicture ? (
           
              <Avatar src={profilePicture} alt="Profile" />
            ) : (
            
              <Avatar sx={{ ...getAvatarStyle(currentUser) }}>
              
                {currentUser ? currentUser.charAt(0).toUpperCase() : ''}
              </Avatar>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Box>
  );
};

export default Header;
