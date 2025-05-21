import { api } from "../../app/api"
import { AddItemFormData } from "./types/types"; // או נתיב מתאים

export const itemApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<any[], string>({ // לקבל מוצרים של משתמש ספציפי
      query: (userId) => `users/${userId}/products`,
      providesTags: (result, error, userId) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Item' as const, id: _id })), { type: 'Item', id: 'LIST' }]
          : [{ type: 'Item', id: 'LIST' }],
    }),
  
    addItem: builder.mutation<any, { userId: string } & AddItemFormData>({
      query: ({ userId, ...itemData }) => ({
        url: `users/${userId}/products`,
        method: 'POST',
        body: itemData,
      }),
      
      invalidatesTags: [{ type: 'Item', id: 'LIST' }],
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

export const { useGetProductsQuery, useAddItemMutation,useUploadImageMutation } = itemApi;