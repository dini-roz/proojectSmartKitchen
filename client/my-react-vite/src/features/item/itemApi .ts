import { api } from "../../app/api"
import { AddItemFormData } from "./types/types"; 
interface UpdateItemFormData {
    userId: string;
    productId: string;
    name: string;
    quantity: number;
    imageUrl?: string; 
    category?: string;
}
interface AddShoppingListItemData {
    name: string;
    quantity: number;
  
}
interface AddPurchasedItemData {
    name: string;
    quantity: string;
  
}
export const itemApi = api.injectEndpoints({
    
  endpoints: (builder) => ({
     deleteShoppingListItem: builder.mutation<void, { userId: string; itemId: string }>({
            query: ({ userId, itemId }) => ({
       
                url: `users/${userId}/shopping-list/${itemId}`, 
                method: 'DELETE',
            }),
          
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, 
                { type: 'Item', id: userId }, 
            ],
        }), 
 deleteItem: builder.mutation<void, { userId: string; productId: string }>({
            query: ({ userId, productId }) => ({
                url: `users/${userId}/products/${productId}`, 
                method: 'DELETE',
            }),
           
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, 
                { type: 'Item', id: userId }, 
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
      query: (userId) => `users/${userId}/shopping-list`, 

   
      providesTags: (result, error, userId) =>
        result
          ? [
            
            
              { type: 'Item' as const, id: 'LIST' },
              { type: 'Item' as const, id: userId }, 
            ]
          : [{ type: 'Item' as const, id: 'LIST' }],
    }), 
 updateItem: builder.mutation<any, UpdateItemFormData>({
            query: ({ userId, productId, ...patch }) => ({
              
                url: `users/${userId}/products/${productId}`,
                method: 'PUT',
                body: patch,
            }),
           
           
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' },
                { type: 'Item', id: userId }, 
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
             
                url: `users/${userId}/kitchen-items/${encodeURIComponent(productName)}`, // השתמש ב-encodeURIComponent
                             
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
                url: `users/${userId}/shopping-list`, 
                method: 'POST',
                body: itemData,
            }),
          
        }),
         addPurchasedItem: builder.mutation<any, { userId: string } & AddPurchasedItemData>({
            query: ({ userId, ...itemData }) => ({
          
                url: `users/${userId}/purchased-items`, 
                method: 'POST',
                body: itemData,
            }),
         
            invalidatesTags: (result, error, { userId }) => [
                { type: 'Item', id: 'LIST' }, 
                { type: 'Item', id: userId },
           
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