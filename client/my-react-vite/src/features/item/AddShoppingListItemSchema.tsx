import { z } from 'zod';


export const AddShoppingListItemSchema = z.object({
  name: z.string().min(2, { message: 'שם המוצר חייב להכיל לפחות 2 תווים.' }).max(100, { message: 'שם המוצר ארוך מדי.' }),
  quantity: z.number().min(1, { message: 'כמות חייבת להיות לפחות 1.' }).int({ message: 'כמות חייבת להיות מספר שלם.' }),
});


export type AddShoppingListItemFormData = z.infer<typeof AddShoppingListItemSchema>;