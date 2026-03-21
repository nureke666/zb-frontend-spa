import type { User } from '../../types/user.types';
import { isValidEmail, isValidIin } from '../../utils/validators';
import {
  REQUIRED_DOCUMENTS,
  WIZARD_STEP_LABELS,
} from './application.constants';
import type {
  ApplicationDraft,
  ApplicationLifecycleStatus,
  ApplicationValidationResult,
  EducationInfo,
  GrantPreference,
  PersonalInfo,
  UploadedDocument,
} from './application.types';

const APPLICATION_DRAFT_STORAGE_KEY = 'applicationDraft';
export const MAX_GRANT_PREFERENCES = 4;

const emptyPersonalInfo = (): PersonalInfo => ({
  firstName: '',
  lastName: '',
  patronymic: '',
  iin: '',
  email: '',
  phone: '',
  birthDate: '',
  region: '',
  city: '',
});

const emptyEducationInfo = (): EducationInfo => ({
  schoolName: '',
  graduationYear: '',
  entScore: '',
  primarySubject: '',
  secondarySubject: '',
  gpa: '',
});

export const createEmptyPreference = (): GrantPreference => ({
  id: `grant-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  region: '',
  university: '',
  program: '',
});

export const createEmptyDraft = (user?: User | null): ApplicationDraft => ({
  id: `draft-${Date.now()}`,
  currentStep: 0,
  personal: {
    ...emptyPersonalInfo(),
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    patronymic: user?.patronymic ?? '',
    iin: user?.iin ?? '',
    email: user?.email ?? '',
  },
  education: emptyEducationInfo(),
  grants: [createEmptyPreference()],
  documents: [],
  updatedAt: null,
  submittedAt: null,
});

const parseStoredDraft = (): ApplicationDraft | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(APPLICATION_DRAFT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as ApplicationDraft;
  } catch {
    window.localStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY);
    return null;
  }
};

export const getStoredDraftSnapshot = (): ApplicationDraft | null =>
  parseStoredDraft();

export const hydrateDraftWithUser = (
  draft: ApplicationDraft,
  user?: User | null,
): ApplicationDraft => ({
  ...draft,
  personal: {
    ...draft.personal,
    firstName: draft.personal.firstName || user?.firstName || '',
    lastName: draft.personal.lastName || user?.lastName || '',
    patronymic: draft.personal.patronymic || user?.patronymic || '',
    iin: draft.personal.iin || user?.iin || '',
    email: draft.personal.email || user?.email || '',
  },
});

export const loadDraft = (user?: User | null): ApplicationDraft => {
  const storedDraft = parseStoredDraft();

  if (!storedDraft) {
    return createEmptyDraft(user);
  }

  return hydrateDraftWithUser(storedDraft, user);
};

export const saveDraft = (draft: ApplicationDraft) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    APPLICATION_DRAFT_STORAGE_KEY,
    JSON.stringify({
      ...draft,
      updatedAt: new Date().toISOString(),
    }),
  );
};

export const clearDraft = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(APPLICATION_DRAFT_STORAGE_KEY);
};

const hasPersonalData = (personal: PersonalInfo) =>
  Object.values(personal).some((value) => value.trim());

const hasEducationData = (education: EducationInfo) =>
  Object.values(education).some((value) => value.trim());

const hasGrantData = (grants: GrantPreference[]) =>
  grants.some((grant) => grant.region || grant.university || grant.program);

const hasDocumentData = (documents: UploadedDocument[]) => documents.length > 0;

export const validatePersonalStep = (
  personal: PersonalInfo,
): ApplicationValidationResult => {
  const errors: ApplicationValidationResult['personalErrors'] = {};

  if (!personal.firstName.trim()) {
    errors.firstName = 'Введите имя.';
  }

  if (!personal.lastName.trim()) {
    errors.lastName = 'Введите фамилию.';
  }

  if (!isValidIin(personal.iin)) {
    errors.iin = 'ИИН должен состоять из 12 цифр.';
  }

  if (!isValidEmail(personal.email)) {
    errors.email = 'Введите корректный email.';
  }

  if (!personal.phone.trim()) {
    errors.phone = 'Введите номер телефона.';
  }

  if (!personal.birthDate) {
    errors.birthDate = 'Укажите дату рождения.';
  }

  if (!personal.region) {
    errors.region = 'Выберите регион.';
  }

  if (!personal.city.trim()) {
    errors.city = 'Введите город или населенный пункт.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    personalErrors: errors,
    message: isValid ? undefined : 'Заполните личные данные полностью.',
  };
};

export const validateEducationStep = (
  education: EducationInfo,
): ApplicationValidationResult => {
  const errors: ApplicationValidationResult['educationErrors'] = {};
  const entScore = Number(education.entScore);
  const graduationYear = Number(education.graduationYear);

  if (!education.schoolName.trim()) {
    errors.schoolName = 'Укажите учебное заведение.';
  }

  if (
    !education.graduationYear.trim() ||
    Number.isNaN(graduationYear) ||
    graduationYear < 2020 ||
    graduationYear > 2035
  ) {
    errors.graduationYear = 'Укажите корректный год.';
  }

  if (
    !education.entScore.trim() ||
    Number.isNaN(entScore) ||
    entScore < 50 ||
    entScore > 140
  ) {
    errors.entScore = 'Балл ЕНТ должен быть от 50 до 140.';
  }

  if (!education.primarySubject) {
    errors.primarySubject = 'Выберите первый профильный предмет.';
  }

  if (!education.secondarySubject) {
    errors.secondarySubject = 'Выберите второй профильный предмет.';
  }

  if (
    education.primarySubject &&
    education.secondarySubject &&
    education.primarySubject === education.secondarySubject
  ) {
    errors.secondarySubject = 'Профильные предметы не должны совпадать.';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    educationErrors: errors,
    message: isValid ? undefined : 'Проверьте данные об образовании и ЕНТ.',
  };
};

export const validateGrantsStep = (
  grants: GrantPreference[],
): ApplicationValidationResult => {
  const completedPreferences = grants.filter(
    (grant) => grant.region && grant.university && grant.program,
  );

  if (completedPreferences.length === 0) {
    return {
      isValid: false,
      message: 'Добавьте хотя бы одно направление с регионом, вузом и программой.',
    };
  }

  const hasIncompletePreference = grants.some(
    (grant) =>
      [grant.region, grant.university, grant.program].some(Boolean) &&
      !(grant.region && grant.university && grant.program),
  );

  if (hasIncompletePreference) {
    return {
      isValid: false,
      message:
        'Каждый добавленный приоритет должен содержать регион, вуз и программу.',
    };
  }

  return { isValid: true };
};

export const validateDocumentsStep = (
  documents: UploadedDocument[],
): ApplicationValidationResult => {
  const uploadedTypes = new Set(documents.map((document) => document.type));
  const missingDocument = REQUIRED_DOCUMENTS.find(
    (document) => !uploadedTypes.has(document.type),
  );

  if (missingDocument) {
    return {
      isValid: false,
      message: `Загрузите документ: ${missingDocument.label}.`,
    };
  }

  return { isValid: true };
};

export const validateStep = (
  draft: ApplicationDraft,
  stepIndex: number,
): ApplicationValidationResult => {
  switch (stepIndex) {
    case 0:
      return validatePersonalStep(draft.personal);
    case 1:
      return validateEducationStep(draft.education);
    case 2:
      return validateGrantsStep(draft.grants);
    case 3:
      return validateDocumentsStep(draft.documents);
    default:
      return { isValid: true };
  }
};

export const getCompletedStepIndexes = (draft: ApplicationDraft) =>
  WIZARD_STEP_LABELS.map((_, index) => index).filter(
    (stepIndex) => validateStep(draft, stepIndex).isValid,
  );

export const getLifecycleStatus = (
  draft: ApplicationDraft,
): ApplicationLifecycleStatus => {
  if (draft.submittedAt) {
    return 'SUBMITTED';
  }

  const hasAnyData =
    hasPersonalData(draft.personal) ||
    hasEducationData(draft.education) ||
    hasGrantData(draft.grants) ||
    hasDocumentData(draft.documents);

  if (!hasAnyData) {
    return 'EMPTY';
  }

  return getCompletedStepIndexes(draft).length === WIZARD_STEP_LABELS.length
    ? 'READY_TO_SUBMIT'
    : 'DRAFT';
};

export const submitDraft = (draft: ApplicationDraft): ApplicationDraft => ({
  ...draft,
  submittedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const resetSubmittedState = (draft: ApplicationDraft): ApplicationDraft =>
  draft.submittedAt
    ? {
        ...draft,
        submittedAt: null,
      }
    : draft;

export type ApplyGrantSelectionStatus =
  | 'added'
  | 'already_exists'
  | 'limit_reached';

export const applyGrantSelection = (
  draft: ApplicationDraft,
  selection: Omit<GrantPreference, 'id'>,
): { draft: ApplicationDraft; status: ApplyGrantSelectionStatus } => {
  const normalizedDraft = resetSubmittedState(draft);
  const alreadyExists = normalizedDraft.grants.some(
    (grant) =>
      grant.region === selection.region &&
      grant.university === selection.university &&
      grant.program === selection.program,
  );

  if (alreadyExists) {
    return {
      draft: {
        ...normalizedDraft,
        currentStep: 2,
        updatedAt: new Date().toISOString(),
      },
      status: 'already_exists',
    };
  }

  const emptyPreferenceIndex = normalizedDraft.grants.findIndex(
    (grant) => !grant.region && !grant.university && !grant.program,
  );

  if (emptyPreferenceIndex >= 0) {
    const grants = [...normalizedDraft.grants];
    grants[emptyPreferenceIndex] = {
      ...grants[emptyPreferenceIndex],
      ...selection,
    };

    return {
      draft: {
        ...normalizedDraft,
        currentStep: 2,
        grants,
        updatedAt: new Date().toISOString(),
      },
      status: 'added',
    };
  }

  if (normalizedDraft.grants.length >= MAX_GRANT_PREFERENCES) {
    return {
      draft: normalizedDraft,
      status: 'limit_reached',
    };
  }

  return {
    draft: {
      ...normalizedDraft,
      currentStep: 2,
      grants: [
        ...normalizedDraft.grants,
        {
          ...createEmptyPreference(),
          ...selection,
        },
      ],
      updatedAt: new Date().toISOString(),
    },
    status: 'added',
  };
};
