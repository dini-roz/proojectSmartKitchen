

import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useAddItemMutation, useGetProductsQuery, useUploadImageMutation } from "./itemApi ";

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddItemSchema, AddItemFormDataZod } from './schema/AddItemSchema ';
import { selectAllProducts, selectCurrentUserName, updateKitchenItems } from '../users/api/authSlice';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { setitem, epose } from './itemslise';
import { useAppDispatch } from '../../app/hooks/useAppDispatch';
import { unitOfCount } from '../food/types/unitOfCount'; 

const categories = ['ירקות', 'פירות', 'חלב', 'דגנים', 'קטניות'];

const AddItemUser: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AddItemFormDataZod>({
    resolver: zodResolver(AddItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
  
      imageUrl: '',
      category: 'ירקות',
    },
  });

  const [addItem, { isLoading: isAddingItem, isSuccess, isError, error }] = useAddItemMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadError }] = useUploadImageMutation();
  const homePageid = useAppSelector(selectCurrentUserName);
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: products, refetch: refetchProducts } = useGetProductsQuery(`${homePageid}`);

  // הגדרת יחידות המידה הזמינות
  const units: unitOfCount[] = ["גרם", "קילו", "כף/ כפות", "כוס/ כוסות"];


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<AddItemFormDataZod> = async (data) => {
    console.log('onSubmit function called!');
    console.log('Form data:', data);

    if (!homePageid) {
      console.error('לא נמצא מזהה משתמש.');
      return;
    }

    let uploadedImageUrl = '';

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const uploadResult = await uploadImage(formData).unwrap();
        uploadedImageUrl = uploadResult.imageUrl;
      }

      const itemDataToSend = { 
        userId: homePageid,
        name: data.name,
        quantity: data.quantity,
       // unit: data.unit, // הוספנו את יחידת המידה כאן
        category: data.category,
        imageUrl: uploadedImageUrl,
      }
 console.log('נתונים לשליחה ל-API:', itemDataToSend);
      const item = await addItem(itemDataToSend).unwrap();

      dispatch(setitem({
        name: item.name,
        category: item.category,
        count: item.quantity,
       // unit: item.unit, // ודא שה-API מחזיר unit
        urlimeg: item.imageUrl 
      }));

      console.log('המוצר נוסף בהצלחה!');

      setSelectedFile(null);
      setImagePreview(null);
      reset();

      if (item != null) {
        const allprodectforyser = await refetchProducts().unwrap();
        dispatch(updateKitchenItems(allprodectforyser));
        console.log(allprodectforyser);
      }

    } catch (err: any) {
      let errorMessage = 'אירעה שגיאה בהוספת המוצר.';
      if (err && 'data' in err && (err.data as any).message) {
        errorMessage = (err.data as any).message;
      } else if (err && 'error' in err) {
        errorMessage = err.error;
      } else if (uploadError && 'data' in uploadError && (uploadError.data as any).message) {
        errorMessage = (uploadError.data as any).message;
      } else if (uploadError && 'error' in uploadError) {
        errorMessage = uploadError.error;
      }
      console.error('שגיאה בהוספת מוצר:', err);
    }
  };

  const overallLoading = isAddingItem || isUploadingImage;

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, borderRadius: '16px', background: '#f5f5f5', mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2 }}>
          הוסף מוצר למטבח
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="שם המוצר"
            autoComplete="name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <FormControl fullWidth margin="normal" required error={!!errors.category}>
            <InputLabel id="category-label">קטגוריה</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              {...register('category')}
              label="קטגוריה"
              defaultValue="ירקות"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            {errors.category && <Typography color="error">{errors.category.message}</Typography>}
          </FormControl>

        
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
            <TextField
              margin="none"
              required
              id="quantity"
              label="כמות"
              type="number"
              inputProps={{ min: '1' }}
              {...register('quantity', { valueAsNumber: true })}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              sx={{ flex: 1 }} 
            />
            <FormControl
              margin="none"
              required
          //    error={!!errors.unit}
              sx={{ flex: 1 }} 
            >
              <InputLabel id="unit-label">מידה</InputLabel>
              <Select
                labelId="unit-label"
                id="unit"
             //   {...register('unit')}
                label="מידה"
                defaultValue="גרם"
              >
                {units.map((unit: string) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
              {/* {errors.unit && (
                <Typography color="error" variant="caption">
                  {errors.unit.message}
                </Typography>
              )} */}
            </FormControl>
          </Box>


        
          <Box sx={{ mt: 2, mb: 1 }}>
            <InputLabel htmlFor="image-upload-button">תמונה (אופציונלי)</InputLabel>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload-button"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload-button">
              <Button variant="outlined" component="span" fullWidth>
                בחר תמונה
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                נבחר קובץ: {selectedFile.name}
              </Typography>
            )}
            {imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img src={imagePreview} alt="תצוגה מקדימה" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            disabled={overallLoading}
          >
            {overallLoading ? 'מוסיף...' : 'הוסף מוצר'}
          </Button>
          {isSuccess && <Typography color="success" sx={{ mt: 2 }}>המוצר נוסף בהצלחה! </Typography>}
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              אירעה שגיאה:
              {error && "data" in error ? (error.data as any).message : "נסה שוב מאוחר יותר."}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default AddItemUser;