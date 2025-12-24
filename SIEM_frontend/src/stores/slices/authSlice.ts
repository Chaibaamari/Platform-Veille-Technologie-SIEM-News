import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { normalizeRole } from '@/lib/auth-utils';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem('auth_token'),
    user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    role: normalizeRole(localStorage.getItem('auth_role')),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        loginSuccess: (state, action: PayloadAction<{
            token: string;
            user: User;
            role: string;
        }>) => {
            const { token, user, role } = action.payload;
            const normalizedRole = normalizeRole(role);
            state.token = token;
            state.user = user;
            state.role = normalizedRole;
            state.isAuthenticated = true;
            state.isLoading = false;

            // Persist to localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('auth_role', normalizedRole || '');
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.role = null;
            state.isAuthenticated = false;
            state.isLoading = false;

            // Clear localStorage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_role');
        },
    },
});

export const { setLoading, loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;