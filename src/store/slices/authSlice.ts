import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface AuthState {
  user: string | null;
}

const initialState: AuthState = {
  user: localStorage.getItem('loggedInUser'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('loggedInUser');
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
