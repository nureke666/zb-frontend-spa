export type UserRole = 'APPLICANT' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string | null;
  iin?: string | null;
  email?: string | null;
  role: UserRole;
}

type LegacyUserCandidate = Partial<User> & {
  name?: string;
};

const getFallbackNameParts = (role: UserRole, legacyName?: string) => {
  if (legacyName?.trim()) {
    const [firstName = 'Пользователь', lastName = 'Системы'] = legacyName
      .trim()
      .split(/\s+/);

    return { firstName, lastName };
  }

  return role === 'ADMIN'
    ? { firstName: 'Системный', lastName: 'Администратор' }
    : { firstName: 'Азамат', lastName: 'Нурбеков' };
};

export const normalizeUser = (candidate: unknown): User | null => {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const legacyUser = candidate as LegacyUserCandidate;

  if (
    legacyUser.role !== 'APPLICANT' &&
    legacyUser.role !== 'ADMIN'
  ) {
    return null;
  }

  const fallbackNameParts = getFallbackNameParts(
    legacyUser.role,
    legacyUser.name,
  );

  return {
    id:
      typeof legacyUser.id === 'string' && legacyUser.id.trim()
        ? legacyUser.id
        : `legacy-${legacyUser.role.toLowerCase()}`,
    firstName:
      typeof legacyUser.firstName === 'string' && legacyUser.firstName.trim()
        ? legacyUser.firstName.trim()
        : fallbackNameParts.firstName,
    lastName:
      typeof legacyUser.lastName === 'string' && legacyUser.lastName.trim()
        ? legacyUser.lastName.trim()
        : fallbackNameParts.lastName,
    patronymic:
      typeof legacyUser.patronymic === 'string' && legacyUser.patronymic.trim()
        ? legacyUser.patronymic.trim()
        : null,
    iin:
      typeof legacyUser.iin === 'string' && legacyUser.iin.trim()
        ? legacyUser.iin.trim()
        : null,
    email:
      typeof legacyUser.email === 'string' && legacyUser.email.trim()
        ? legacyUser.email.trim()
        : null,
    role: legacyUser.role,
  };
};
