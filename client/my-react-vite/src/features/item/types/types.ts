import { unitOfCount } from "../../food/types/unitOfCount"; 
export interface AddItemFormData {
  name: string;
  quantity: number;
  imageUrl?: string;
  category: 'ירקות' | 'פירות' | 'חלב' | 'דגנים' | 'קטניות';

}





