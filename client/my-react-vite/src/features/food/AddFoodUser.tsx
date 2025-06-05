
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { AddFoodFormDataZod, AddFoodSchema } from "./schema/AddFoodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddfoodMutation } from "./foodApi";
import { useGetAllFoodQuery,  } from "../food/foodApi";
import {useUploadImageMutation} from "../item/itemApi "
import { useAppSelector } from "../../app/hooks/useAppSelector";
import { selectCurrentUserName, updeteKitchenFoods } from "../users/api/authSlice";
import { useAppDispatch } from "../../app/hooks/useAppDispatch";
import { useState } from "react";
import { setFood } from "./foodSlice";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { unitOfCount } from "./types/unitOfCount";

type AddFoodMutationPayLoud = { userId: string } & AddFoodFormDataZod;

const AddFoodUser: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control, // Added control for useFieldArray
  } = useForm<AddFoodFormDataZod>({
    resolver: zodResolver(AddFoodSchema),
    defaultValues: {
      name: "",
      ingredients: [{ itemName: "", quantity: 1, unit: "גרם" }], // Initialize with one ingredient field
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const [addFood, { isLoading: isAddingItem, isSuccess, isError, error }] =
    useAddfoodMutation();
  const [uploadImage, { isLoading: isUploadingImage, error: uploadError }] =
    useUploadImageMutation();
     const homePageid = useAppSelector(selectCurrentUserName);
      const { data: products, refetch: refetchfood } =useGetAllFoodQuery (`${homePageid}`);
 
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
 // const { data: products, refetch: refetchProducts } = useGetProductsQuery(
  //  `${homePageid}`
 // );

  const units: unitOfCount[] = ["גרם", "קילו", "כף/ כפות", "כוס/ כוסות"];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("imageUrl", reader.result as string, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreview(null);
      setValue("imageUrl", "", { shouldValidate: true });
    }
  };

  const onSubmit: SubmitHandler<AddFoodFormDataZod> = async (data) => {
    console.log("onSubmit function called!");
    console.log("Form data:", data);

    if (!homePageid) {
      console.error("לא נמצא מזהה משתמש.");
      return;
    }

    let uploadedImageUrl = '';

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadResult = await uploadImage(formData).unwrap();
        uploadedImageUrl = uploadResult.imageUrl;
      }
       const transformedIngredients = data.ingredients.map(ing => ({
      itemName: ing.itemName,
      quantity: { // יוצרים אובייקט quantity עם value ו-unit
        value: ing.quantity, // כאן ה-ing.quantity הוא המספר (1)
        unit: ing.unit
      },
      // itemId: ing.itemId // אם קיים ונדרש
    }));
      const foodSlice = {
        userId: homePageid,
        name: data.name,
        ingredients: transformedIngredients,//data.ingredients,
        imageUrl: uploadedImageUrl, // Ensure imageUrl is passed to addFood
      };

      const food = await addFood(foodSlice).unwrap();
      dispatch(
        setFood({
          name: food.name,
          imageUrl: food.imageUrl, // Corrected typo here, assuming your API returns 'imageUrl'
          ingredients: food.ingredients,
        })
      );
      console.log("המאכל נוסף בהצלחה!");
      setSelectedFile(null);
      setImagePreview(null);
      reset(); // Reset the form fields, including the ingredient array
      
     if (food != null) {
       const allFoodForUser = await refetchfood().unwrap();
       dispatch(updeteKitchenFoods(allFoodForUser));
       console.log(allFoodForUser);
     }
    } catch (err: any) {
      let errorMessage = "אירעה שגיאה בהוספת המאכל.";
      if (err && "data" in err && (err.data as any).message) {
        errorMessage = (err.data as any).message;
      } else if (err && "error" in err) {
        errorMessage = err.error;
      } else if (
        uploadError &&
        "data" in uploadError &&
        (uploadError.data as any).message
      ) {
        errorMessage = (uploadError.data as any).message;
      } else if (uploadError && "error" in uploadError) {
        errorMessage = uploadError.error;
      }
      console.error("שגיאה בהוספת מאכל:", errorMessage);
    }
  };

  const overallLoading = isAddingItem || isUploadingImage;

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ padding: 4, borderRadius: "16px", background: "#f5f5f5", mt: 4 }}
      >
        <Typography component="h1" variant="h5" align="center" sx={{ marginBottom: 2 }}>
          הוסף מאכל למטבח
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="שם המאכל"
            autoComplete="name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            רכיבים:
          </Typography>
          {fields.map((field, index) => (
            <Box
              key={field.id}
              sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}
            >
              <TextField
                margin="none"
                required
                id={`ingredients[${index}].itemName`}
                label="שם רכיב"
                autoComplete="item name"
                {...register(`ingredients.${index}.itemName`)}
                error={!!errors.ingredients?.[index]?.itemName}
                helperText={errors.ingredients?.[index]?.itemName?.message}
                sx={{ flex: 3 }}
              />
              <TextField
                margin="none"
                required
                id={`ingredients[${index}].quantity`}
                label="כמות"
                type="number"
                inputProps={{ min: "1" }}
                {...register(`ingredients.${index}.quantity`, {
                  valueAsNumber: true,
                })}
                error={!!errors.ingredients?.[index]?.quantity}
                helperText={errors.ingredients?.[index]?.quantity?.message}
                sx={{ flex: 1.5 }}
              />
              <FormControl
                margin="none"
                required
                error={!!errors.ingredients?.[index]?.unit}
                sx={{ flex: 1.5 }}
              >
                <InputLabel id={`unit-label-${index}`}>מידה</InputLabel>
                <Select
                  labelId={`unit-label-${index}`}
                  id={`ingredients[${index}].unit`}
                  {...register(`ingredients.${index}.unit`)}
                  label="מידה"
                  defaultValue="גרם"
                >
                  {units.map((unit: string) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
                {errors.ingredients?.[index]?.unit && (
                  <Typography color="error" variant="caption">
                    {errors.ingredients?.[index]?.unit?.message}
                  </Typography>
                )}
              </FormControl>
              <IconButton
                onClick={() => remove(index)}
                color="error"
                aria-label="מחק רכיב"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            type="button" // Important: set type to "button" to prevent form submission
            variant="outlined"
            onClick={() => append({ itemName: "", quantity: 1, unit: "גרם" })}
            startIcon={<AddIcon />}
            fullWidth
            sx={{ mt: 1, mb: 2 }}
          >
            הוסף רכיב
          </Button>

          <Box sx={{ mt: 2, mb: 1 }}>
            <InputLabel htmlFor="image-upload-button">
              תמונה (אופציונלי)
            </InputLabel>
            <input
              accept="image/*"
              style={{ display: "none" }}
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
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={imagePreview}
                  alt="תצוגה מקדימה"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "8px",
                  }}
                />
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
            {overallLoading ? "מוסיף..." : "הוסף מאכל"}
          </Button>
          {isSuccess && (
            <Typography color="success" sx={{ mt: 2 }}>
              המאכל נוסף בהצלחה!{" "}
            </Typography>
          )}
          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              אירעה שגיאה:{" "}
              {error && "data" in error ? (error.data as any).message : "נסה שוב מאוחר יותר."}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default AddFoodUser;