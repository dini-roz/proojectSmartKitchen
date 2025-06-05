import { api } from "../../app/api";
import { AddFoodFormData } from './types/types'

export const foodApi=api.injectEndpoints({
    endpoints: (builder)=>({
        getAllFood:builder.query<any[],string>({
            query:(userId)=>`users/${userId}/foods`,
            providesTags:(result, error, userId)=>
            result
            ? [...result.map(({ _id }) => ({ type: 'Food' as const, id: _id })), { type: 'Item', id: 'LIST' }]
            : [{ type: 'Food', id: 'LIST' }],
        }),
        addfood: builder.mutation<any, { userId: string } & AddFoodFormData>({
            query: ({ userId, ...foodData }) => ({
              url: `users/${userId}/foods`,
              method: 'POST',
              body: foodData,
            }),
            
            invalidatesTags: [{ type: 'Food', id: 'LIST' }],
          }),
      deleteFood: builder.mutation<any, { userId: string; foodId: string }>({
    query: ({ userId, foodId }) => ({
        url: `users/${userId}/foods/${foodId}`,
        method: 'DELETE',
    }),
    invalidatesTags: (result, error, { foodId }) => [{ type: 'Food', id: foodId }, { type: 'Food', id: 'LIST' }],
}),

        updateFood: builder.mutation<any, { userId: string; foodId: string; foodData: Partial<AddFoodFormData> }>({
            query: ({ userId, foodId, foodData }) => ({
                url: `users/${userId}/foods/${foodId}`,
                method: 'PUT', // או 'PATCH' תלוי איך השרת שלך מטפל בעדכונים חלקיים/מלאים
                body: foodData,
            }),
            // invalidateTags גם לרשימה וגם לפריט הספציפי שהשתנה
            invalidatesTags: (result, error, { foodId }) => [{ type: 'Food', id: foodId }, { type: 'Food', id: 'LIST' }],
        }),
    }),

})
export const {useGetAllFoodQuery , useAddfoodMutation, useDeleteFoodMutation, useUpdateFoodMutation  } = foodApi;