
import * as z from 'zod';

export const AddItemSchema = z.object({
  name: z.string().min(1, { message: 'שם המוצר נדרש' }),
  quantity: z.number().min(1, { message: 'הכמות חייבת להיות לפחות 1' }).int(),
  // שינוי כאן: מאפשר מחרוזת ריקה בנוסף ל-URL תקין או undefined
  imageUrl: z.string().url({ message: 'כתובת URL לא תקינה' }).optional().or(z.literal('')), 
  category: z.enum(['ירקות', 'פירות', 'חלב', 'דגנים', 'קטניות'], {
    errorMap: () => ({ message: 'קטגוריה לא חוקית' }),
  }),
});

export type AddItemFormDataZod = z.infer<typeof AddItemSchema>;
