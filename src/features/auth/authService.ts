import { apiClient, authStorage, isMockApiEnabled } from '../../api/apiClient';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../../types/api.types';
import type { User, UserRole } from '../../types/user.types';

interface MockAuthUserRecord extends User {
  password: string;
}

const MOCK_USERS_KEY = 'mock-auth-users';
const MOCK_NETWORK_DELAY_MS = 450;

const delay = (ms = MOCK_NETWORK_DELAY_MS) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const capitalize = (value: string) => {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const readMockUsers = (): MockAuthUserRecord[] => {
  const rawValue = window.localStorage.getItem(MOCK_USERS_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as MockAuthUserRecord[];
  } catch {
    window.localStorage.removeItem(MOCK_USERS_KEY);
    return [];
  }
};

const saveMockUsers = (users: MockAuthUserRecord[]) => {
  window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

const upsertMockUser = (user: MockAuthUserRecord) => {
  const users = readMockUsers();
  const index = users.findIndex(
    (candidate) => candidate.email === user.email || candidate.iin === user.iin,
  );

  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }

  saveMockUsers(users);
};

const createAuthResponse = (user: User): AuthResponse => ({
  accessToken: `mock-access-token-${user.role.toLowerCase()}-${user.id}`,
  refreshToken: `mock-refresh-token-${user.id}`,
  user,
});

const buildFallbackApplicant = (identifier: string): MockAuthUserRecord => {
  const [firstNameCandidate, lastNameCandidate] = identifier
    .split('@')[0]
    .replace(/[^a-zA-Zа-яА-Я0-9]+/g, ' ')
    .trim()
    .split(/\s+/);

  return {
    id: 'mock-applicant-1',
    firstName: capitalize(firstNameCandidate || 'Азамат'),
    lastName: capitalize(lastNameCandidate || 'Нурбеков'),
    patronymic: null,
    iin: /^\d{12}$/.test(identifier) ? identifier : '000000000000',
    email: identifier.includes('@') ? identifier : 'applicant@example.com',
    role: 'APPLICANT',
    password: 'password',
  };
};

const buildAdminUser = (): MockAuthUserRecord => ({
  id: 'mock-admin-1',
  firstName: 'Системный',
  lastName: 'Администратор',
  patronymic: null,
  iin: null,
  email: 'admin@zharqyn.local',
  role: 'ADMIN',
  password: 'admin',
});

const loginWithMock = async ({
  identifier,
  password,
}: LoginRequest): Promise<AuthResponse> => {
  await delay();

  if (identifier.trim().toLowerCase() === 'admin') {
    if (!password.trim()) {
      throw new Error('Введите пароль администратора.');
    }

    return createAuthResponse(buildAdminUser());
  }

  const savedUser = readMockUsers().find(
    (candidate) =>
      candidate.email?.toLowerCase() === identifier.toLowerCase() ||
      candidate.iin === identifier,
  );

  if (savedUser) {
    if (savedUser.password !== password) {
      throw new Error('Неверный пароль.');
    }

    return createAuthResponse(savedUser);
  }

  if (!password.trim()) {
    throw new Error('Введите пароль.');
  }

  return createAuthResponse(buildFallbackApplicant(identifier));
};

const registerWithMock = async (
  payload: RegisterRequest,
): Promise<AuthResponse> => {
  await delay();

  const registeredUser: MockAuthUserRecord = {
    id: `mock-user-${Date.now()}`,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    patronymic: payload.patronymic?.trim() || null,
    iin: payload.iin.trim(),
    email: payload.email.trim().toLowerCase(),
    role: 'APPLICANT',
    password: payload.password,
  };

  upsertMockUser(registeredUser);

  return createAuthResponse(registeredUser);
};

const getMeWithMock = async (): Promise<User> => {
  await delay(200);

  const user = authStorage.getUser();

  if (!user) {
    throw new Error('Сессия не найдена. Войдите заново.');
  }

  return user;
};

const loginWithApi = async (payload: LoginRequest) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

const registerWithApi = async (payload: RegisterRequest) => {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

const getMeWithApi = async () => {
  const response = await apiClient.get<User>('/users/me');
  return response.data;
};

const logoutFromApi = async () => {
  await apiClient.post('/auth/logout');
};

const shouldUseMockAuth = () => isMockApiEnabled;

const persistSession = (session: AuthResponse) => {
  authStorage.saveSession(session);
  return session;
};

export const authService = {
  async login(payload: LoginRequest) {
    const session = shouldUseMockAuth()
      ? await loginWithMock(payload)
      : await loginWithApi(payload);

    return persistSession(session);
  },
  async register(payload: RegisterRequest) {
    const session = shouldUseMockAuth()
      ? await registerWithMock(payload)
      : await registerWithApi(payload);

    return persistSession(session);
  },
  async getMe() {
    const user = shouldUseMockAuth()
      ? await getMeWithMock()
      : await getMeWithApi();

    authStorage.setUser(user);
    return user;
  },
  async logout() {
    try {
      if (!shouldUseMockAuth()) {
        await logoutFromApi();
      }
    } finally {
      authStorage.clear();
    }
  },
  clearSession() {
    authStorage.clear();
  },
  getDefaultRoute(role: UserRole) {
    return role === 'ADMIN' ? '/admin' : '/dashboard';
  },
};
