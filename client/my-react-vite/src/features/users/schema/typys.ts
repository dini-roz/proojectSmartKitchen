export interface User {
  _id?: string;
  username: string;
  name: string;
  password?: string; 
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    CVV: string;
  };
  email: string;
  phone?: string;
  kitchenItems?: {
    itemId?: string; // או mongoose.Schema.Types.ObjectId אם את מייצגת את זה כמחרוזת
    quantity?: number;
    category?: string;
  }[];
  shoppingList?: {
    itemId?: string; // או mongoose.Schema.Types.ObjectId
    purchaseDay?: '1' | '2' | '3' | '4' | '5';
  }[];
  food?: {
    mealId?: string; // או mongoose.Schema.Types.ObjectId
  }[];
}