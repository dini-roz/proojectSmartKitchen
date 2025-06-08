
import { unitOfCount } from "./unitOfCount";


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
// export type IngredientFormData = {
//   name: string;
//   itemName: string;
//   quantity: QuantityWithUnit; 
 
// };
export   interface IngredientFormData {
  name: string; // This is the required property
  quantity: {
    value: number;
    unit: unitOfCount;
  };
}

export type AddFoodFormData = {
  name: string;
  imageUrl?: string; 
  ingredients: IngredientFormData[];
};