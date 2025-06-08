
import { z } from "zod";
import { unitOfCount } from "../types/unitOfCount"

export const IngredientSchema = z.object({
  itemName: z.string().min(1, "שם רכיב הוא שדה חובה"),
  quantity: z.number().min(1, "כמות חייבת להיות לפחות 1"),
  unit: z.enum(['גרם', 'קילו', 'כף/ כפות', 'כוס/ כוסות'], {
    errorMap: () => ({ message: "מידה לא חוקית" }),
  }) as z.ZodType<unitOfCount>, 
});

export const AddFoodSchema = z.object({
  name: z.string().min(1, "שם המאכל הוא שדה חובה"),
  imageUrl: z.string().optional(),
  ingredients: z.array(IngredientSchema).min(1, "חובה להוסיף לפחות רכיב אחד"),
});

export type AddFoodFormDataZod = z.infer<typeof AddFoodSchema>;