export interface AddItemFormData {
  name: string;
  quantity: number;
  imageUrl?: string;
  category: 'ירקות' | 'פירות' | 'חלב' | 'דגנים' | 'קטניות';
}