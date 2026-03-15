import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Тип нашего юзера
interface User {
  id: string;
  name: string;
  role: 'APPLICANT' | 'ADMIN';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  // При запуске проверяем, есть ли уже токен в браузере (чтобы не выкидывало при F5)
  isAuthenticated: !!localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Действие при успешном логине
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      // Сохраняем в память браузера
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    // Действие при выходе
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;