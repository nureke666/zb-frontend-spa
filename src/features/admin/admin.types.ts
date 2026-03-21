export type AdminApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WAITING_DOCUMENTS';

export interface AdminApplicationRecord {
  id: string;
  applicantName: string;
  email: string;
  iin: string;
  entScore: number | null;
  createdAt: string;
  updatedAt: string;
  status: AdminApplicationStatus;
  region: string;
  city: string;
  universityNames: string[];
  programNames: string[];
  profileSubjects: string[];
  documentsCount: number;
  requiredDocumentsCount: number;
  source: 'seed' | 'draft';
}

export interface AdminDashboardSummary {
  totalApplications: number;
  approved: number;
  rejected: number;
  pendingReview: number;
  availableGrants: number;
}

export interface AdminRegionMetric {
  name: string;
  count: number;
}

export interface AdminSubjectMetric {
  name: string;
  value: number;
  color: string;
}

export interface AdminDashboardData {
  summary: AdminDashboardSummary;
  applicationsByRegion: AdminRegionMetric[];
  entSubjects: AdminSubjectMetric[];
  recentApplications: AdminApplicationRecord[];
}
