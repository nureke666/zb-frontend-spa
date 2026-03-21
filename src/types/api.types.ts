import type { User } from './user.types';

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, string | string[]>;
  status?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  patronymic?: string;
  iin: string;
  email: string;
  password: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
