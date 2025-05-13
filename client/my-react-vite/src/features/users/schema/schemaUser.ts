import * as z from 'zod';
export const SignupSchema = z.object({
  username: z.string().min(1, { message: 'שם משתמש נדרש' }),
  name: z.string().min(1, { message: 'שם נדרש' }),
  email: z.string().email({ message: 'אימייל לא תקין' }).min(1, { message: 'אימייל נדרש' }),
  password: z.string().min(8, { message: 'סיסמה חייבת להיות באורך מינימלי של 8 תווים' }),
  phone: z.string().min(9, { message: 'חייב להכיל מספר טלפון' }).optional(),
  cardNumber: z.string().optional().refine((val) => !val || /^\d{13,19}$/.test(val), {
  message: "מספר כרטיס לא תקין",
  }),
  expiryDate: z.string().optional().refine((val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
  message: "תאריך תפוגה לא תקין (MM/YY)",
  }),
  CVV: z.string().optional().refine((val) => !val || /^\d{3,4}$/.test(val), {
  message: "CVV לא תקין",
  }),
 });
export type SignupFormData = z.infer<typeof SignupSchema>;