export type ApplicationLifecycleStatus =
  | 'EMPTY'
  | 'DRAFT'
  | 'READY_TO_SUBMIT'
  | 'SUBMITTED';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  patronymic: string;
  iin: string;
  email: string;
  phone: string;
  birthDate: string;
  region: string;
  city: string;
}

export interface EducationInfo {
  schoolName: string;
  graduationYear: string;
  entScore: string;
  primarySubject: string;
  secondarySubject: string;
  gpa: string;
}

export interface GrantPreference {
  id: string;
  region: string;
  university: string;
  program: string;
}

export type DocumentType = 'ID_CARD' | 'CERTIFICATE' | 'ENT_RESULT';

export interface UploadedDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ApplicationDraft {
  id: string;
  currentStep: number;
  personal: PersonalInfo;
  education: EducationInfo;
  grants: GrantPreference[];
  documents: UploadedDocument[];
  updatedAt: string | null;
  submittedAt: string | null;
}

export type PersonalInfoErrors = Partial<Record<keyof PersonalInfo, string>>;
export type EducationInfoErrors = Partial<Record<keyof EducationInfo, string>>;

export interface ApplicationValidationResult {
  isValid: boolean;
  message?: string;
  personalErrors?: PersonalInfoErrors;
  educationErrors?: EducationInfoErrors;
}
