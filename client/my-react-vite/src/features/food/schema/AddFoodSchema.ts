import * as z from 'zod';

export const AddFoodSchema = z.object({
  name: z.string().min(1, { message: 'שם המוצר נדרש' }),
  count: z.number().min(1, { message: 'הכמות חייבת להיות גדולה מ 0' }).int(),
  unit:z.string().min(1,{message: 'המילה צריכה להכיל לפחות אות אחת'})
 
 
});

export type AddFoodFormDataZod = z.infer<typeof AddFoodSchema>;


