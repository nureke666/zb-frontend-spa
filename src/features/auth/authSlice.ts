import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authStorage, mapApiError } from '../../api/apiClient';
import type {
  ApiErrorResponse,
  AsyncStatus,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../types/api.types';
import type { User } from '../../types/user.types';
import { authService } from './authService';

interface AuthState {
  isAuthenticated: boolean;
  isSessionChecked: boolean;
  status: AsyncStatus;
  user: User | null;
  error: string | null;
}

const applyAuthenticatedState = (
  state: AuthState,
  payload: { user: User } | AuthResponse,
) => {
  state.isAuthenticated = true;
  state.isSessionChecked = true;
  state.status = 'succeeded';
  state.user = payload.user;
  state.error = null;
};

const resetAuthState = (state: AuthState) => {
  state.isAuthenticated = false;
  state.isSessionChecked = true;
  state.status = 'idle';
  state.user = null;
  state.error = null;
};

const getErrorMessage = (
  payload: ApiErrorResponse | undefined,
  fallbackMessage: string,
) => payload?.message || fallbackMessage;

export const bootstrapSession = createAsyncThunk<
  User | null,
  void,
  { rejectValue: ApiErrorResponse }
>('auth/bootstrapSession', async (_, { rejectWithValue }) => {
  if (!authStorage.getAccessToken()) {
    return null;
  }

  try {
    return await authService.getMe();
  } catch (error) {
    authService.clearSession();
    return rejectWithValue(mapApiError(error));
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: ApiErrorResponse }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    return await authService.login(payload);
  } catch (error) {
    return rejectWithValue(mapApiError(error));
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: ApiErrorResponse }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    return await authService.register(payload);
  } catch (error) {
    return rejectWithValue(mapApiError(error));
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await authService.logout();
});

const initialState: AuthState = {
  isAuthenticated: Boolean(authStorage.getAccessToken()),
  isSessionChecked: !authStorage.getAccessToken(),
  status: 'idle',
  user: authStorage.getUser(),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
      if (state.status === 'failed') {
        state.status = 'idle';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.isSessionChecked = false;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.isSessionChecked = true;
        state.error = null;

        if (action.payload) {
          applyAuthenticatedState(state, { user: action.payload });
          return;
        }

        resetAuthState(state);
      })
      .addCase(bootstrapSession.rejected, (state) => {
        resetAuthState(state);
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applyAuthenticatedState(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = getErrorMessage(
          action.payload,
          'Не удалось выполнить вход.',
        );
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        applyAuthenticatedState(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = getErrorMessage(
          action.payload,
          'Не удалось зарегистрировать пользователя.',
        );
      })
      .addCase(logoutUser.fulfilled, (state) => {
        resetAuthState(state);
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
