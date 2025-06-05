// import * as z from 'zod';

// export const AddFoodSchema = z.object({
//   name: z.string().min(1, { message: 'נדרש שם המאכל' }),
//   imageUrl: z.string().url({ message: 'כתובת URL לא תקינה' }).optional().or(z.literal('')), 
//   ingredients: z.array(z.object({
//     count:z.string().min(1,{ message: 'הכמות חייבת להיות גדולה מ 0' }),
//     unit:z.enum(['גרם','קילו','כף/ כפות','כוס/ כוסות']),
//     itemName:z.string().min(2,{ message: 'המילה צריכה להכיל לפחות אות אחת' })
//   } 
//   )).nonempty('חייב להיות כלול מוצר אחד לפחות'),
// });

// export type AddFoodFormDataZod = z.infer<typeof AddFoodSchema>;

import { z } from "zod";
import { unitOfCount } from "../types/unitOfCount"

export const IngredientSchema = z.object({
  itemName: z.string().min(1, "שם רכיב הוא שדה חובה"),
  quantity: z.number().min(1, "כמות חייבת להיות לפחות 1"),
  unit: z.enum(['גרם', 'קילו', 'כף/ כפות', 'כוס/ כוסות'], {
    errorMap: () => ({ message: "מידה לא חוקית" }),
  }) as z.ZodType<unitOfCount>, // ודא שסוג unitOfCount מוסק נכון
});

export const AddFoodSchema = z.object({
  name: z.string().min(1, "שם המאכל הוא שדה חובה"),
  imageUrl: z.string().optional(),
  ingredients: z.array(IngredientSchema).min(1, "חובה להוסיף לפחות רכיב אחד"),
});

export type AddFoodFormDataZod = z.infer<typeof AddFoodSchema>;