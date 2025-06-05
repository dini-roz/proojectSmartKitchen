import { api } from "../../app/api"
import { AddItemFormData } from "./types/types"; 
interface UpdateItemFormData {
    userId: string;
    productId: string;
    name: string;
    quantity: number;
    imageUrl?: string; // שדה אופציונלי עבור URL של תמונה
    category?: string; // שדה אופציונלי עבור קטגוריה
}
interface AddShoppingListItemData {
    name: string;
    quantity: number;
    // אם השרת שלך דורש שדות נוספים עבור רשימת קניות, הוסף אותם כאן
}
interface AddPurchasedItemData {
    name: string;
    quantity: string;
    // אם השרת שלך מצפה לשדות נוספים עבור פריט שנרכש (כמו תאריך רכישה, קטגוריה וכו'), הוסף אותם כאן
}
export const itemApi = api.injectEndpoints({
    
  endpoints: (builder) => ({
     deleteShoppingListItem: builder.mutation<void, { userId: string; itemId: string }>({
            query: ({ userId, itemId }) => ({
                // וודא שה-URL הזה תואם ל-route שיהיה לך ב-Backend
                // לדוגמה: DELETE /api/users/:userId/shopping-list/:itemId
                url: `users/${userId}/shopping-list/${itemId}`, 
                method: 'DELETE',
            }),
            // חשוב מאוד: invalidatesTags כדי שה-cache יתעדכן ורשימת הקניות תרוענן
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, // תגית כללית לרענון כל רשימת הפריטים
                { type: 'Item', id: userId }, // תגית ספציפית למשתמש זה
            ],
        }), 
 deleteItem: builder.mutation<void, { userId: string; productId: string }>({
            query: ({ userId, productId }) => ({
                url: `users/${userId}/products/${productId}`, // נתיב ה-API למחיקה
                method: 'DELETE',
            }),
            // חשוב מאוד: invalidatesTags כדי שהרשימה תתעדכן
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, // כדי לבצע רענון לרשימת המוצרים הכללית
                { type: 'Item', id: userId }, // אם יש לך קאש ספציפי למשתמש
            ],
        }),
  
   getProducts: builder.query<any[], string>({ 
  query: (userId) => `users/${userId}/products`,

  providesTags: (result, error, userId) =>
    result
      ? [...result.map(({ _id }) => ({ type: 'Item' as const, id: _id })), { type: 'Item', id: 'LIST' }]
      : [{ type: 'Item', id: 'LIST' }],
}),
    getShoppingList: builder.query<any[], string>({
      query: (userId) => `users/${userId}/shopping-list`, // נתיב API לדוגמה לרשימת קניות

      // הגדרת providesTags המשתמשת בתגית 'Item'
      providesTags: (result, error, userId) =>
        result
          ? [
              // אם הפריטים ברשימת הקניות מכילים _id, נוכל לייצר תגים ספציפיים לכל פריט
              // לדוגמה: ...result.map(({ _id }) => ({ type: 'Item' as const, id: _id })),
              { type: 'Item' as const, id: 'LIST' }, // תג לרשימה כולה (כללית ל'Item')
              { type: 'Item' as const, id: userId }, // תג ספציפי למשתמש זה (כללי ל'Item')
            ]
          : [{ type: 'Item' as const, id: 'LIST' }], // אם אין תוצאות, ספק רק את תג ה-LIST
    }), 
 updateItem: builder.mutation<any, UpdateItemFormData>({
            query: ({ userId, productId, ...patch }) => ({
                // וודא שה-URL תואם בדיוק ל-route בשרת: /api/users/:userId/products/:productId
                url: `users/${userId}/products/${productId}`,
                method: 'PUT',
                body: patch, // שולח את ה-name, quantity, imageUrl, category
            }),
            // **חשוב: invalidatesTags כדי לרענן את נתוני המטבח של המשתמש לאחר עדכון**
            // **שימוש בתגיות קיימות**: Item ו-LIST
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' },
                { type: 'Item', id: userId }, // תג ספציפי למשתמש שיגרום לרענון ה-query
            ],
        }),
   
    addItem: builder.mutation<any, { userId: string } & AddItemFormData>({
      query: ({ userId, ...itemData }) => ({
        url: `users/${userId}/products`,
        method: 'POST',
        body: itemData,
      }),
       
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
     
    }),
     updateProductQuantity: builder.mutation<any, { userId: string, productName: string, newQuantity: number }>({
            query: ({ userId, productName, newQuantity }) => ({
                // אחת משתי האפשרויות הבאות היא הנכונה:
                // 1. אם ה-baseUrl שלך ב-app/api/index.ts (או איפה שהגדרת את ה-api) הוא '/api' (או http://localhost:PORT/api)
                // אז הנתיב כאן צריך להיות רק ההמשך:
                url: `users/${userId}/kitchen-items/${encodeURIComponent(productName)}`, // השתמש ב-encodeURIComponent
                
                // 2. אם ה-baseUrl שלך הוא רק '/' (או http://localhost:PORT)
                // אז הנתיב כאן צריך לכלול את '/api':
                // url: `/api/users/${userId}/kitchen-items/${encodeURIComponent(productName)}`, // השתמש ב-encodeURIComponent
                
                method: 'PUT',
                body: { quantity: newQuantity },
            }),
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' },
                { type: 'Item', id: userId },
            ],
        }),
           addShoppingListItem: builder.mutation<any, { userId: string } & AddShoppingListItemData>({
            query: ({ userId, ...itemData }) => ({
                url: `users/${userId}/shopping-list`, // נתיב API לדוגמה עבור רשימת קניות
                method: 'POST',
                body: itemData,
            }),
            // אם יש לך תגית ספציפית לרשימת קניות, הוסף אותה כאן
            // לדוגמה: invalidatesTags: [{ type: 'ShoppingList', id: 'LIST' }],
            // אם אין, המוטציה עדיין תעבוד, אך עדכון אוטומטי של רשימת קניות מצד הלקוח יהיה פחות יעיל.
            // לצורך ההדגמה, נשאיר ללא invalidatesTags ספציפיים כאן, אם כי מומלץ להוסיף.
        }),
         addPurchasedItem: builder.mutation<any, { userId: string } & AddPurchasedItemData>({
            query: ({ userId, ...itemData }) => ({
                // וודא שנתיב ה-API הזה תואם ל-route שיהיה לך ב-Backend עבור מוצרים שנרכשו
                // לדוגמה: POST /api/users/:userId/purchased-items
                url: `users/${userId}/purchased-items`, 
                method: 'POST',
                body: itemData,
            }),
            // חשוב: invalidatesTags לרענון רשימת המוצרים הכללית לאחר רכישה
            // אם יש לך query ספציפי למוצרים שנרכשו, הוסף לו תגית משלו (לדוגמה 'PurchasedItem')
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, // כדי לרענן את רשימת המוצרים הכללית
                { type: 'Item', id: userId }, // רענון מוצרים ספציפיים למשתמש
                // אם אתה מציג את המוצרים שנרכשו בנפרד, כדאי להוסיף תגית ייעודית
                // { type: 'PurchasedItem', id: 'LIST' },
                // { type: 'PurchasedItem', id: userId },
            ],
        }),
     uploadImage: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: 'upload-image', 
        method: 'POST',
        body: formData, 
      }),
     
    }),
 
  }),

  overrideExisting: false,
});

export const {  useGetProductsQuery,useDeleteItemMutation
     , useAddItemMutation,useUploadImageMutation,useUpdateItemMutation,useUpdateProductQuantityMutation
      ,useAddShoppingListItemMutation ,useGetShoppingListQuery ,
      useDeleteShoppingListItemMutation ,useAddPurchasedItemMutation} = itemApi;