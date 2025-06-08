


import { useState } from "react";
import { Button, Grid, Typography, Container, Box, CssBaseline } from "@mui/material";
import AddItemUser from '../item/AddItemUser';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName, selectShoppingList } from '../users/api/authSlice';
import ProductSearch from '../item/showProductSearch';
import ItemAddShopingListe from "../item/ItemAddShopingListe";
import AddFoodUser from "../food/AddFoodUser";

const HomePage: React.FC = () => {

  const [showAddItem, setShowAddItem] = useState<boolean>(false);
  const [showAddFood, setShowAddFood] = useState<boolean>(false);
  const [showShoppingList, setShowShoppingList] = useState<boolean>(false);
  const [showProductSearch, setShowProductSearch] = useState<boolean>(false);
  const userName = useAppSelector(selectCurrentUserName);
  const liste = useAppSelector(selectShoppingList);
  const handleShowComponent = (componentName: string) => {
    setShowAddItem(false);
    setShowAddFood(false);
    setShowShoppingList(false);
    setShowProductSearch(false);

    if (componentName === 'addItem') setShowAddItem(true);
    else if (componentName === 'addFood') setShowAddFood(true);
    else if (componentName === 'shoppingList') setShowShoppingList(true);
    else if (componentName === 'productSearch') setShowProductSearch(true);
  };

  return (
  
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center', 
        minHeight: '100vh', 
        width: '100vw', 
       
        backgroundColor: '#f5f5f5', 
        p: 2 
      }}
    >
      <CssBaseline />

      
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 3, 
          p: 4, 
          boxShadow: 6, 
          textAlign: 'center',
          minWidth: { xs: '90%', sm: '70%', md: '50%' } 
        }}
      >
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          שלום ל- {userName}!
        </Typography>
       
        <Typography variant="h5" component="p" sx={{ mb: 4, color: '#7f8c8d' }}>
          ברוך הבא לרובוט המטבחי החכם שלך!
        </Typography>

     
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleShowComponent('addItem')}
              sx={{ height: 60, fontSize: '1.1rem', borderRadius: 2 }}
            >
              הוספת מוצר
            </Button>
          </Grid>
          <Grid >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleShowComponent('addFood')}
              sx={{ height: 60, fontSize: '1.1rem', borderRadius: 2 }}
            >
              הוספת מאכל
            </Button>
          </Grid>
          <Grid >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleShowComponent('shoppingList')}
              sx={{ height: 60, fontSize: '1.1rem', borderRadius: 2 }}
            >
              רשימת קניות
            </Button>
          </Grid>
        </Grid>

      
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowComponent('productSearch')}
            sx={{ width: 'auto', minWidth: 220, height: 60, fontSize: '1.2rem', borderRadius: 2 }} 
          >
            איזה מאכל תכין הייום?
            תכתוב את שם המאכל המבוקש:
          </Button>
        </Box>

        
        {showAddItem && <AddItemUser />}
        {showAddFood && <AddFoodUser />}
        {showShoppingList && <ItemAddShopingListe />}
        {showProductSearch && <ProductSearch />}
      </Container>
    </Box>
  );
};

export default HomePage;