import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  CVV: string;
}
interface DefaultAvatar {
  letter: string;
  color: string;
}
interface KitchenItem {
  _id:any | null | undefined;
  category: any;
  imageUrl: any;
  itemId: string; 
  quantity: number;
  name: string;
}
interface ShoppingListItem {
  _id: string;
  name: string; 
  quantity :string;

}
interface FoodItem {
   ingredients: any;
   
   name: string | undefined;
   imageUrl: string;
   _id: any | null | undefined;
  //  ingredients: any;
  //  ingredients: any;
  //  name: ReactNode;
  //  name: string | undefined;
  //  imageUrl: string;
  //  _id: Key | null | undefined;
   mealId: string;
  // name?: string; // Added name and imageUrl to FoodItem interface for consistency
  // imageUrl?: string;
  // ingredients?: any[]; // Added ingredients for FoodItem interface
}
interface AuthState {
  user_id:string
  username: string |null;
  name: string | null;
  password: string | null; 
  paymentDetails: PaymentDetails | null;
  email: string;
  phone :string |null,
  kitchenItems: KitchenItem[]| null
  shoppingList: ShoppingListItem[] |null
  food: FoodItem[] | null
 
  profilePicture: string | null;
   defaultAvatar: DefaultAvatar | null
}

const initialState: AuthState = {
  user_id:"",
  username: null,
  name: "null",
  password:"null",
  paymentDetails:null,
  email:"null",
  phone :null,
  kitchenItems: [],
  shoppingList: [],
  food:[],
 
  profilePicture: null,
  defaultAvatar:null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateKitchenItems: (state, action: PayloadAction<KitchenItem[]>) => {
      state.kitchenItems = action.payload;
    },
    updeteShopingliste:(state, action: PayloadAction<ShoppingListItem[]>)=>{
       state.shoppingList = action.payload;
    }, updeteKitchenFoods:(state, action: PayloadAction< FoodItem[]>)=>{
       state.food = action.payload;
    },

    setCredentials: (
      state,
     action: PayloadAction<{ user_id: string;username : string;name :string; password :
       string; paymentDetails :PaymentDetails; email:string; phone:string; kitchenItems :KitchenItem[];shoppingList:ShoppingListItem[];food: FoodItem[];profilePicture: string;}>
    ) => {
      state.user_id = action.payload.user_id;
      state.username = action.payload.username
      state.name = action.payload.name
      state.password = action.payload.password
      state.paymentDetails=action.payload.paymentDetails
      state.email=action.payload.email
      state.phone=action.payload.phone,
     state .kitchenItems=action.payload.kitchenItems
      state.shoppingList=action.payload.shoppingList
      state.food=action.payload.food
      state.profilePicture=action.  payload.profilePicture
       state.profilePicture = action.payload.profilePicture;
    
  if (!action.payload.profilePicture && action.payload.username) {
    const firstLetter = action.payload.username.charAt(0).toUpperCase();
    const hue = action.payload.username.charCodeAt(0) * 15 % 360;
    const color = `hsl(${hue}, 70%, 50%)`;
    state.defaultAvatar = { letter: firstLetter, color };
  } else {
    state.defaultAvatar = null;
  }
    },
   
    logout: (state) => {
      state.user_id = "null"
      state.username ="null"
      state.name = "null"
      state.password = "null"
      state.paymentDetails=null
      state.email="null"
      state.phone="null"
     state .kitchenItems=[]
      state.shoppingList=[]
      state.food=[]
      state.profilePicture=null
    },
  },
});

export const { updeteKitchenFoods,setCredentials, logout,updateKitchenItems ,updeteShopingliste } = authSlice.actions;

export default authSlice.reducer;



export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.name;
export const selectCurrentUserName = (state: { auth: AuthState }) => state.auth.username;
export const selectUserProfilePicture = (state:{auth: AuthState}) => state.auth.profilePicture
export const selectDefaultAvatar = (state: { auth: AuthState }) => state.auth.defaultAvatar;
export const selectAllProducts = (state: { auth: AuthState }) => state.auth.kitchenItems;
export const updeteKitchenFood= (state: { auth: AuthState }) => state.auth.food;
export const selectShoppingList = (state: { auth: AuthState }) => state.auth.shoppingList;
export const selectuserid = (state: { auth: AuthState }) => state.auth.user_id;
