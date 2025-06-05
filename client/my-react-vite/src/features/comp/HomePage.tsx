


import { useState } from "react";
import { Button, Grid, Typography, Container, Box, CssBaseline } from "@mui/material"; // הוספתי CssBaseline
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
    // Box חיצוני שימלא את כל המסך וירכז את התוכן
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // סדר את הפריטים בעמודה
        justifyContent: 'center', // מרכז אנכית
        alignItems: 'center', // מרכז אופקית
        minHeight: '100vh', // ודא שיתפרס על כל גובה המסך
        width: '100vw', // ודא שיתפרס על כל רוחב המסך
        // רקע לבן נקי כפי שרצית
        backgroundColor: '#f5f5f5', // גוון לבן מעט שבור (אפור בהיר מאוד)
        p: 2 // ריפוד קטן מסביב לכל הקומפוננטה
      }}
    >
      <CssBaseline /> {/* איפוס CSS בסיסי לדפדפנים */}

      {/* הקונטיינר המרכזי עם התוכן */}
      <Container
        maxWidth="md"
        sx={{
          backgroundColor: '#ffffff', // רקע לבן נקי לתוכן עצמו
          borderRadius: 3, // פינות מעוגלות
          p: 4, // ריפוד פנימי
          boxShadow: 6, // צל עמוק יותר לבולטות
          textAlign: 'center', // מרכז את הטקסטים בתוך הקונטיינר
          minWidth: { xs: '90%', sm: '70%', md: '50%' } // רוחב מינימלי בנקודות שבירה שונות
        }}
      >
        {/* כיתוב "שלום ל- username" במרכז */}
        <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
          שלום ל- {userName}!
        </Typography>
        {/* כיתוב "ברוך הבא לרובוט המטבחי שלך!" במרכז */}
        <Typography variant="h5" component="p" sx={{ mb: 4, color: '#7f8c8d' }}>
          ברוך הבא לרובוט המטבחי החכם שלך!
        </Typography>

        {/* כפתורים רוחביים במרכז */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid > {/* הגדלתי את רוחב הכפתורים מעט */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleShowComponent('addItem')}
              sx={{ height: 60, fontSize: '1.1rem', borderRadius: 2 }} // פינות מעוגלות לכפתורים
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

        {/* כפתור חיפוש מוצר באמצע, מתחת לכפתורים האחרים */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleShowComponent('productSearch')}
            sx={{ width: 'auto', minWidth: 220, height: 60, fontSize: '1.2rem', borderRadius: 2 }} // כפתור חיפוש גדול ובולט יותר
          >
            איזה מאכל תכין הייום?
            תכתוב את שם המאכל המבוקש:
          </Button>
        </Box>

        {/* הצגת הקומפוננטה הרצויה */}
        {showAddItem && <AddItemUser />}
        {showAddFood && <AddFoodUser />}
        {showShoppingList && <ItemAddShopingListe />}
        {showProductSearch && <ProductSearch />}
      </Container>
    </Box>
  );
};

export default HomePage;