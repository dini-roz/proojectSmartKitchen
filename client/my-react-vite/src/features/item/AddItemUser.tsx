
 import React, { useState } from 'react'; 
 import { TextField, Button, Container, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
 import { useAddItemMutation, useUploadImageMutation } from "./itemApi "; // נניח שזה הנתיב הנכון ל-itemApi
 import { useParams } from 'react-router-dom';
 import { useForm, SubmitHandler } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { AddItemSchema, AddItemFormDataZod } from './schema/AddItemSchema ' // נתיב לסכמת Zod
 import { useDispatch, useSelector } from 'react-redux';
import {
  setFormSubmitting,
  setSubmissionError,
  resetFormState,
  selectIsFormSubmitted,
  selectSubmissionError,
} from './itemFormSlice';

const categories = ['ירקות', 'פירות', 'חלב', 'דגנים', 'קטניות'];

type AddItemMutationPayload = { userId: string } & AddItemFormDataZod;

const AddItemUser: React.FC = () => {
  // הוספת setValue מ-useForm כדי לעדכן שדות באופן ידני
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AddItemFormDataZod>({
    resolver: zodResolver(AddItemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      imageUrl: '', // חשוב שזה יהיה מחרוזת ריקה כברירת מחדל
      category: 'ירקות',
    },
  });

  const [addItem, { isLoading: isAddingItem, isSuccess, isError, error }] = useAddItemMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadError }] = useUploadImageMutation();
  const { homePageid } = useParams();

  const dispatch = useDispatch();
  const isFormSubmitted = useSelector(selectIsFormSubmitted);
  const submissionError = useSelector(selectSubmissionError);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // עדכון שדה imageUrl ב-react-hook-form state עם ה-Data URL הזמני
        // זה חשוב כדי שהולידציה של Zod תעבור אם יש תמונה
        setValue('imageUrl', reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      // איפוס שדה imageUrl ב-react-hook-form state כשאין קובץ
      setValue('imageUrl', '', { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<AddItemFormDataZod> = async (data) => {
    console.log('onSubmit function called!');
    console.log('Form data:', data); // הדפסת הנתונים שהתקבלו מ-react-hook-form

    if (!homePageid) {
      console.error('לא נמצא מזהה משתמש.');
      dispatch(setSubmissionError('לא נמצא מזהה משתמש.'));
      dispatch(setFormSubmitting(false));
      return;
    }

    dispatch(setFormSubmitting(true));
    dispatch(setSubmissionError(null));

    let uploadedImageUrl = '';

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadResult = await uploadImage(formData).unwrap();
        uploadedImageUrl = uploadResult.imageUrl;
      }

      
        const itemDataToSend: AddItemMutationPayload = {
        userId: homePageid,
        name: data.name,
        quantity: data.quantity,
        category: data.category,
        imageUrl: uploadedImageUrl, // שימוש מפורש ב-URL שהתקבל מהשרת
      };

      await addItem(itemDataToSend).unwrap();

      console.log('המוצר נוסף בהצלחה!');
      reset();
      dispatch(resetFormState());
      setSelectedFile(null);
      setImagePreview(null);

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
      dispatch(setSubmissionError(errorMessage));
    } finally {
      dispatch(setFormSubmitting(false));
    }
  };

  const overallLoading = isAddingItem || isUploadingImage || isFormSubmitted;

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
          {/* קלט קובץ לתמונה */}
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
          {isSuccess && <Typography color="success" sx={{ mt: 2 }}>המוצר נוסף בהצלחה!</Typography>}
          {submissionError && <Typography color="error" sx={{ mt: 2 }}>{submissionError}</Typography>}
        </form>
      </Paper>
    </Container>
  );
};

export default AddItemUser;
