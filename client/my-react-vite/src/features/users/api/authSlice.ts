import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  username: any;
  userId: string | null;
  userName: string | null; 
  token: string | null; 
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: "111",
  userName: null,
  token: null,
  isAuthenticated: false,
  username: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   
    setCredentials: (
      state,
     action: PayloadAction<{ userid: string; username: string; password: string }>
    ) => {
      state.userId = action.payload.userid;
      state.userName = action.payload.username
      state.token = action.payload.password
      state.isAuthenticated = true;
    },
    // פעולה לאיפוס המצב בעת התנתקות
    logout: (state) => {
      state.userId = null;
      state.userName = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

// סלקטורים נוחים לגישה לנתונים מה-store
export const selectCurrentUserId = (state: { auth: AuthState }) => state.auth.userId;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUserName = (state: { auth: AuthState }) => state.auth.userName;
