import { apiClient, isMockApiEnabled } from '../../api/apiClient';
import {
  PROGRAM_OPTIONS,
  REGION_OPTIONS,
  REQUIRED_DOCUMENTS,
  UNIVERSITY_OPTIONS,
} from '../application/application.constants';
import { getStoredDraftSnapshot } from '../application/applicationDraft';
import type { ApplicationDraft } from '../application/application.types';
import type {
  AdminApplicationRecord,
  AdminApplicationStatus,
  AdminDashboardData,
  AdminDashboardSummary,
  AdminRegionMetric,
  AdminSubjectMetric,
} from './admin.types';

const ADMIN_APPLICATIONS_STORAGE_KEY = 'mock-admin-applications';
const DEFAULT_AVAILABLE_GRANTS = 850;
const MOCK_NETWORK_DELAY_MS = 280;
const SUBJECT_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EF4444',
  '#06B6D4',
];

const SEED_APPLICATIONS: AdminApplicationRecord[] = [
  {
    id: 'A-2026-1045',
    applicantName: 'Нурбол Касымов',
    email: 'nurbol@example.com',
    iin: '020415123456',
    entScore: 125,
    createdAt: '2026-03-12T10:20:00.000Z',
    updatedAt: '2026-03-12T14:00:00.000Z',
    status: 'APPROVED',
    region: 'almaty',
    city: 'Алматы',
    universityNames: ['Satbayev University'],
    programNames: ['Нефтегазовое дело (B064)'],
    profileSubjects: ['Математика', 'Физика'],
    documentsCount: 3,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'seed',
  },
  {
    id: 'A-2026-1044',
    applicantName: 'Айгерим Сыздыкова',
    email: 'aigerim@example.com',
    iin: '030822987654',
    entScore: 118,
    createdAt: '2026-03-12T08:40:00.000Z',
    updatedAt: '2026-03-12T12:15:00.000Z',
    status: 'UNDER_REVIEW',
    region: 'astana',
    city: 'Астана',
    universityNames: ['Евразийский национальный университет'],
    programNames: ['Менеджмент и управление (B044)'],
    profileSubjects: ['География', 'Иностранный язык'],
    documentsCount: 3,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'seed',
  },
  {
    id: 'A-2026-1043',
    applicantName: 'Диас Маратов',
    email: 'dias@example.com',
    iin: '010510654321',
    entScore: 95,
    createdAt: '2026-03-11T13:00:00.000Z',
    updatedAt: '2026-03-11T17:50:00.000Z',
    status: 'REJECTED',
    region: 'atyrau',
    city: 'Атырау',
    universityNames: ['Atyrau University'],
    programNames: ['Логистика и supply chain (B061)'],
    profileSubjects: ['География', 'Иностранный язык'],
    documentsCount: 2,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'seed',
  },
  {
    id: 'A-2026-1042',
    applicantName: 'Амина Серикова',
    email: 'amina@example.com',
    iin: '040112112233',
    entScore: 105,
    createdAt: '2026-03-11T09:10:00.000Z',
    updatedAt: '2026-03-11T10:45:00.000Z',
    status: 'WAITING_DOCUMENTS',
    region: 'almaty',
    city: 'Алматы',
    universityNames: ['Казахский национальный медицинский университет'],
    programNames: ['Общая медицина (B086)'],
    profileSubjects: ['Биология', 'Химия'],
    documentsCount: 2,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'seed',
  },
  {
    id: 'A-2026-1041',
    applicantName: 'Тимур Болатов',
    email: 'timur@example.com',
    iin: '021105445566',
    entScore: 130,
    createdAt: '2026-03-10T15:25:00.000Z',
    updatedAt: '2026-03-10T16:00:00.000Z',
    status: 'SUBMITTED',
    region: 'astana',
    city: 'Астана',
    universityNames: ['Назарбаев Университет'],
    programNames: ['Компьютерные науки (B059)'],
    profileSubjects: ['Математика', 'Физика'],
    documentsCount: 3,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'seed',
  },
];

const delay = (ms = MOCK_NETWORK_DELAY_MS) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const readStoredApplications = (): AdminApplicationRecord[] => {
  if (typeof window === 'undefined') {
    return SEED_APPLICATIONS;
  }

  const rawValue = window.localStorage.getItem(ADMIN_APPLICATIONS_STORAGE_KEY);

  if (!rawValue) {
    return SEED_APPLICATIONS;
  }

  try {
    return JSON.parse(rawValue) as AdminApplicationRecord[];
  } catch {
    window.localStorage.removeItem(ADMIN_APPLICATIONS_STORAGE_KEY);
    return SEED_APPLICATIONS;
  }
};

const saveStoredApplications = (applications: AdminApplicationRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    ADMIN_APPLICATIONS_STORAGE_KEY,
    JSON.stringify(applications),
  );
};

const getRegionLabel = (value: string) =>
  REGION_OPTIONS.find((region) => region.value === value)?.label || value;

const getUniversityLabel = (value: string) =>
  UNIVERSITY_OPTIONS.find((university) => university.value === value)?.label ||
  value;

const getProgramLabel = (value: string) =>
  PROGRAM_OPTIONS.find((program) => program.value === value)?.label || value;

const createApplicationCode = (seed: string, createdAt: string) => {
  const hash = seed.split('').reduce((accumulator, character) => {
    return (accumulator * 31 + character.charCodeAt(0)) % 9000;
  }, 1000);

  return `A-${new Date(createdAt).getFullYear()}-${hash}`;
};

const buildDraftApplicationRecord = (
  draft: ApplicationDraft | null,
): AdminApplicationRecord | null => {
  if (!draft?.submittedAt) {
    return null;
  }

  const completedPreferences = draft.grants.filter(
    (grant) => grant.region && grant.university && grant.program,
  );

  const uniqueUniversityNames = [
    ...new Set(
      completedPreferences.map((grant) => getUniversityLabel(grant.university)),
    ),
  ];
  const uniqueProgramNames = [
    ...new Set(
      completedPreferences.map((grant) => getProgramLabel(grant.program)),
    ),
  ];
  const profileSubjects = [
    draft.education.primarySubject,
    draft.education.secondarySubject,
  ].filter(Boolean);
  const createdAt = draft.submittedAt;

  return {
    id: createApplicationCode(draft.id, createdAt),
    applicantName: [
      draft.personal.lastName,
      draft.personal.firstName,
      draft.personal.patronymic,
    ]
      .filter(Boolean)
      .join(' '),
    email: draft.personal.email || 'not-provided@example.com',
    iin: draft.personal.iin || '000000000000',
    entScore: draft.education.entScore ? Number(draft.education.entScore) : null,
    createdAt,
    updatedAt: draft.updatedAt || createdAt,
    status:
      draft.documents.length >= REQUIRED_DOCUMENTS.length
        ? 'SUBMITTED'
        : 'WAITING_DOCUMENTS',
    region: draft.personal.region || completedPreferences[0]?.region || '',
    city: draft.personal.city || '',
    universityNames: uniqueUniversityNames,
    programNames: uniqueProgramNames,
    profileSubjects,
    documentsCount: draft.documents.length,
    requiredDocumentsCount: REQUIRED_DOCUMENTS.length,
    source: 'draft',
  };
};

const sortApplications = (applications: AdminApplicationRecord[]) =>
  [...applications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

const mergeDraftApplication = (
  applications: AdminApplicationRecord[],
): AdminApplicationRecord[] => {
  const draftApplication = buildDraftApplicationRecord(getStoredDraftSnapshot());

  if (!draftApplication) {
    return sortApplications(applications);
  }

  const nextApplications = [...applications];
  const existingIndex = nextApplications.findIndex(
    (application) => application.id === draftApplication.id,
  );

  if (existingIndex >= 0) {
    nextApplications[existingIndex] = {
      ...draftApplication,
      status: nextApplications[existingIndex].status,
      updatedAt: nextApplications[existingIndex].updatedAt,
    };
  } else {
    nextApplications.push(draftApplication);
  }

  return sortApplications(nextApplications);
};

const buildSummary = (
  applications: AdminApplicationRecord[],
): AdminDashboardSummary => {
  const approved = applications.filter(
    (application) => application.status === 'APPROVED',
  ).length;
  const rejected = applications.filter(
    (application) => application.status === 'REJECTED',
  ).length;
  const pendingReview = applications.filter((application) =>
    ['SUBMITTED', 'UNDER_REVIEW', 'WAITING_DOCUMENTS'].includes(
      application.status,
    ),
  ).length;

  return {
    totalApplications: applications.length,
    approved,
    rejected,
    pendingReview,
    availableGrants: Math.max(0, DEFAULT_AVAILABLE_GRANTS - approved),
  };
};

const buildRegionMetrics = (
  applications: AdminApplicationRecord[],
): AdminRegionMetric[] => {
  const counts = applications.reduce<Record<string, number>>((accumulator, application) => {
    const label = getRegionLabel(application.region || 'unknown');
    accumulator[label] = (accumulator[label] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count);
};

const buildSubjectMetrics = (
  applications: AdminApplicationRecord[],
): AdminSubjectMetric[] => {
  const counts = applications.reduce<Record<string, number>>((accumulator, application) => {
    application.profileSubjects.forEach((subject) => {
      accumulator[subject] = (accumulator[subject] || 0) + 1;
    });

    return accumulator;
  }, {});

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6)
    .map(([name, value], index) => ({
      name,
      value,
      color: SUBJECT_COLORS[index % SUBJECT_COLORS.length],
    }));
};

const downloadCsvFile = (applications: AdminApplicationRecord[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  const rows = [
    [
      'ID',
      'ФИО',
      'Email',
      'ИИН',
      'Балл ЕНТ',
      'Статус',
      'Регион',
      'Программы',
      'Дата подачи',
    ],
    ...applications.map((application) => [
      application.id,
      application.applicantName,
      application.email,
      application.iin,
      application.entScore?.toString() || '',
      application.status,
      getRegionLabel(application.region),
      application.programNames.join(' | '),
      application.createdAt,
    ]),
  ];

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const listMockApplications = async () => {
  await delay();
  return mergeDraftApplication(readStoredApplications());
};

const updateMockApplicationStatus = async (
  applicationId: string,
  status: AdminApplicationStatus,
) => {
  await delay(180);

  const applications = mergeDraftApplication(readStoredApplications());
  const applicationIndex = applications.findIndex(
    (application) => application.id === applicationId,
  );

  if (applicationIndex < 0) {
    throw new Error('Заявка не найдена.');
  }

  const updatedApplication: AdminApplicationRecord = {
    ...applications[applicationIndex],
    status,
    updatedAt: new Date().toISOString(),
  };

  const nextApplications = [...applications];
  nextApplications[applicationIndex] = updatedApplication;
  saveStoredApplications(nextApplications);

  return updatedApplication;
};

export const adminService = {
  async listApplications() {
    if (isMockApiEnabled) {
      return listMockApplications();
    }

    const response = await apiClient.get<AdminApplicationRecord[]>(
      '/admin/applications',
    );
    return response.data;
  },
  async updateApplicationStatus(
    applicationId: string,
    status: AdminApplicationStatus,
  ) {
    if (isMockApiEnabled) {
      return updateMockApplicationStatus(applicationId, status);
    }

    const response = await apiClient.patch<AdminApplicationRecord>(
      `/admin/applications/${applicationId}/status`,
      { status },
    );
    return response.data;
  },
  async getDashboardData(): Promise<AdminDashboardData> {
    if (isMockApiEnabled) {
      const applications = await listMockApplications();

      return {
        summary: buildSummary(applications),
        applicationsByRegion: buildRegionMetrics(applications),
        entSubjects: buildSubjectMetrics(applications),
        recentApplications: applications.slice(0, 5),
      };
    }

    const response = await apiClient.get<AdminDashboardData>('/admin/dashboard');
    return response.data;
  },
  async downloadApplicationsCsv(applications?: AdminApplicationRecord[]) {
    const dataset = applications || (await adminService.listApplications());
    downloadCsvFile(dataset);
  },
};
