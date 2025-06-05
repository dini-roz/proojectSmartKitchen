import { unitOfCount } from "../../food/types/unitOfCount"; // ודא שהנתיב נכון
export interface AddItemFormData {
  name: string;
  quantity: number;
  imageUrl?: string;
  category: 'ירקות' | 'פירות' | 'חלב' | 'דגנים' | 'קטניות';
   // unit: unitOfCount;
}





