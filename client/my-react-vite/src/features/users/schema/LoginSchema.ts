import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: "כתובת אימייל לא חוקית" }),
  password: z.string().min(6, { message: "הסיסמה חייבת להיות לפחות 6 תווים" }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;