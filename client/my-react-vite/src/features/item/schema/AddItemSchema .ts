
import * as z from 'zod';
import { unitOfCount } from "../../food/types/unitOfCount"; 

export const AddItemSchema = z.object({
  name: z.string().min(1, { message: 'שם המוצר נדרש' }),
  quantity: z.number().min(1, { message: 'הכמות חייבת להיות לפחות 1' }).int(),
  
  imageUrl: z.string().url({ message: 'כתובת URL לא תקינה' }).or(z.literal('')), 
  //  unit: z.enum(['גרם', 'קילו', 'כף/ כפות', 'כוס/ כוסות'], {
  //   errorMap: () => ({ message: "מידה לא חוקית" }),
  // }) as z.ZodType<unitOfCount>, 
  category: z.enum(['ירקות', 'פירות', 'חלב', 'דגנים', 'קטניות'], {
    errorMap: () => ({ message: 'קטגוריה לא חוקית' }),
    
  }),
});

export type AddItemFormDataZod = z.infer<typeof AddItemSchema>;
