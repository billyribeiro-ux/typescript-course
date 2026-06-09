import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  currentUserId: string | null;
}

const initialState: AuthState = { currentUserId: "u1" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.currentUserId = action.payload;
    },
    logout: (state) => {
      state.currentUserId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
