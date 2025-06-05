import { api } from "../../../app/api";
export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    getUser: builder.query<any, string>({
      query: (userName) => `users/${userName}`,
      providesTags: (result, error, userName) => [{ type: 'User', id: userName }],
    }),
    updateUser: builder.mutation<any, { userName: string; data: Object }>({
      query: ({ userName, data }) => ({
        url: `users/${userName}`, 
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { userName }) => [{ type: 'User', id: userName }],
    }),
    createUser: builder.mutation<any, Object>({
      
      query: (data) => ({
        url: 'users', 
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'], 
    }),
      login: builder.mutation<any, Object>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials, 
      }),
      //
      invalidatesTags: ['User'], 
          }),
  }),
  overrideExisting: false, 
});


export const { 
  useGetUserQuery, 
  useUpdateUserMutation, 
  useCreateUserMutation ,
  useLoginMutation
} = userApi;