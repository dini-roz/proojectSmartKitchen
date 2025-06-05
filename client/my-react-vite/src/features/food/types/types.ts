// import { unitOfCount } from "./unitOfCount";

// export type ingredient = Omit<AddFoodFormData, "count" | "unitOfCount" | "itemName">;

// export interface AddFoodFormData {
//     name: string;
//     ingredients: { count: string, unit: unitOfCount, itemName: string }[];
// }

// import { unitOfCount } from "../types/unitOfCount"; // ודא שהנתיב נכון

// export type IngredientFormData = {
//   itemName: string;
//   quantity: number; // שינוי מ-'count: string' ל-'quantity: number'
//   unit: unitOfCount;
// };

// export type AddFoodFormData = {
//   name: string;
//   imageUrl?: string; // הופך את imageUrl לאופציונלי כפי שמוגדר בטופס
//   ingredients: IngredientFormData[];
// };
import { unitOfCount } from "./unitOfCount"; // ודא שהנתיב נכון

// ממשק חדש שמייצג את אובייקט הכמות עם הערך והיחידה
export interface QuantityWithUnit {
  value: number;
  unit: unitOfCount;
}
export interface FoodItem {
  _id: string;
  name: string;
  imageUrl: string;
  ingredients: IngredientFormData[];
}
export type IngredientFormData = {
  name: string;
  itemName: string;
  quantity: QuantityWithUnit; // שינוי לשימוש בממשק החדש QuantityWithUnit
  // הסרנו את unit מכאן כי הוא עכשיו חלק מ-QuantityWithUnit
};

export type AddFoodFormData = {
  name: string;
  imageUrl?: string; // הופך את imageUrl לאופציונלי כפי שמוגדר בטופס
  ingredients: IngredientFormData[];
};