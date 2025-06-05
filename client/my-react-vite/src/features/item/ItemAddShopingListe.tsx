
import React from 'react'; 
import { TextField, Button, Container, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddShoppingListItemSchema, AddShoppingListItemFormData } from "../item/AddShoppingListItemSchema"
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName, updeteShopingliste } from '../users/api/authSlice';
import { useAddShoppingListItemMutation, useGetShoppingListQuery } from "../item/itemApi "
import { useAppDispatch } from '../../app/hooks/useAppDispatch';

const ItemAddShopingListe: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddShoppingListItemFormData>({
    resolver: zodResolver(AddShoppingListItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
    },
  });
   const homePageid = useAppSelector(selectCurrentUserName);
      const dispatch = useAppDispatch(); 

  const userName = useAppSelector(selectCurrentUserName);
  
  const [addShoppingListItem, { isLoading, isSuccess, isError, error }] = useAddShoppingListItemMutation();
 const {    data: shopingg, refetch: refetchShoping } = useGetShoppingListQuery(   `${homePageid}`);
  const onSubmit: SubmitHandler<AddShoppingListItemFormData> = async (data) => {
    if (!userName) {
      // במקרה של שגיאה כזו, ייתכן שתרצי לנתב למסך התחברות או להציג הודעה קבועה.
      console.error('שגיאה: לא נמצא מזהה משתמש. אנא התחבר מחדש.');
      return;
    }

    try {
      // נניח שה-API מקבל userId בנוסף לשם וכמות
   const shoping=     await addShoppingListItem({ userId: userName, ...data }).unwrap();
   console.log(shoping)


      reset(); // איפוס הטופס לאחר הצלחה
    if (shoping!=null)  {
     const sohp=  await refetchShoping().unwrap()
        console.log("fff")
             dispatch(updeteShopingliste(sohp));
        console.log(sohp)


    }
    } catch (err) {
      // RTK Query כבר מטפל בשגיאה ושם אותה ב-`error`
      console.error("שגיאה בסאבמיט של רשימת קניות:", err);
    }
  
  };
 

  // פונקציית עזר להצגת הודעת שגיאה מפורטת
  const getErrorMessage = (err: any): string => {
    if (!err) return 'אירעה שגיאה בלתי צפויה.';
    if ('data' in err && typeof err.data === 'object' && 'message' in err.data) {
      return (err.data as { message: string }).message;
    }
    if ('error' in err && typeof err.error === 'string') {
      return err.error;
    }
    return 'אירעה שגיאה כללית.';
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px', background: '#ffffff', mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2, color: '#333' }}>
          הוספת מוצר לרשימת הקניות
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="שם המוצר"
            autoComplete="off"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity"
            label="כמות"
            type="number"
            inputProps={{ min: '1' }}
            {...register('quantity', { valueAsNumber: true })}
            error={!!errors.quantity}
            helperText={errors.quantity?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
            disabled={isLoading} // שימוש ישיר ב-isLoading
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'מוסיף...' : 'הוסף לרשימה'}
          </Button>

          {/* הודעות חיווי למשתמש - שימוש ישיר ב-isSuccess/isError */}
          {isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              המוצר נוסף בהצלחה לרשימת הקניות!
            </Alert>
          )}
          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {getErrorMessage(error)}
            </Alert>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default ItemAddShopingListe;