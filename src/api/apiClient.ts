import axios, { AxiosHeaders } from 'axios';
import type { ApiErrorResponse, AuthResponse } from '../types/api.types';
import { normalizeUser, type User } from '../types/user.types';

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080/api';
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000);

const storage = typeof window !== 'undefined' ? window.localStorage : null;

const readJson = <T>(key: string): T | null => {
  const rawValue = storage?.getItem(key);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    storage?.removeItem(key);
    return null;
  }
};

export const isMockApiEnabled = import.meta.env.VITE_USE_MOCK_API !== 'false';

export const authStorage = {
  getAccessToken: () => storage?.getItem(ACCESS_TOKEN_KEY) ?? null,
  setAccessToken: (token: string) => storage?.setItem(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => storage?.getItem(REFRESH_TOKEN_KEY) ?? null,
  setRefreshToken: (token?: string | null) => {
    if (!token) {
      storage?.removeItem(REFRESH_TOKEN_KEY);
      return;
    }

    storage?.setItem(REFRESH_TOKEN_KEY, token);
  },
  getUser: () => {
    const parsedUser = readJson<unknown>(USER_KEY);
    const normalizedUser = normalizeUser(parsedUser);

    if (!normalizedUser) {
      storage?.removeItem(USER_KEY);
      return null;
    }

    storage?.setItem(USER_KEY, JSON.stringify(normalizedUser));
    return normalizedUser;
  },
  setUser: (user: User) =>
    storage?.setItem(USER_KEY, JSON.stringify(normalizeUser(user) ?? user)),
  saveSession: (session: AuthResponse) => {
    authStorage.setAccessToken(session.accessToken);
    authStorage.setRefreshToken(session.refreshToken);
    authStorage.setUser(session.user);
  },
  clear: () => {
    storage?.removeItem(ACCESS_TOKEN_KEY);
    storage?.removeItem(REFRESH_TOKEN_KEY);
    storage?.removeItem(USER_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken();

  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

export const mapApiError = (error: unknown): ApiErrorResponse => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responsePayload = error.response?.data;

    return {
      message:
        responsePayload?.message ||
        error.message ||
        'Не удалось выполнить запрос. Попробуйте еще раз.',
      code: responsePayload?.code,
      details: responsePayload?.details,
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Произошла непредвиденная ошибка.' };
};
