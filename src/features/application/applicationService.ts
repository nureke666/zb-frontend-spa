import { apiClient, isMockApiEnabled } from '../../api/apiClient';

export interface ApplicationStep {
  step: number;
  data: Record<string, any>;
  completed: boolean;
}

export interface ApplicationDraft {
  id?: string;
  userId: string;
  steps: ApplicationStep[];
  selectedPrograms: string[]; // Program IDs
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationSubmitPayload {
  steps: ApplicationStep[];
  selectedPrograms: string[];
}

// Mock implementation
const getMockDrafts = (): ApplicationDraft[] => {
  const stored = localStorage.getItem('mock-applications');
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveMockDrafts = (drafts: ApplicationDraft[]) => {
  localStorage.setItem('mock-applications', JSON.stringify(drafts));
};

const getDraftsWithMock = async (): Promise<ApplicationDraft[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMockDrafts();
};

const saveDraftWithMock = async (draft: ApplicationDraft): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const drafts = getMockDrafts();
  const existing = drafts.findIndex((d) => d.id === draft.id);

  if (existing >= 0) {
    drafts[existing] = draft;
  } else {
    draft.id = `draft-${Date.now()}`;
    drafts.push(draft);
  }

  saveMockDrafts(drafts);
};

const deleteDraftWithMock = async (draftId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const drafts = getMockDrafts();
  const filtered = drafts.filter((d) => d.id !== draftId);
  saveMockDrafts(filtered);
};

const submitWithMock = async (
  draft: ApplicationDraft,
): Promise<{ id: string; status: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  draft.status = 'submitted';
  await saveDraftWithMock(draft);
  return {
    id: draft.id || `submitted-${Date.now()}`,
    status: 'submitted',
  };
};

// API implementation
const getDraftsWithApi = async (): Promise<ApplicationDraft[]> => {
  try {
    const response = await apiClient.get<any>('/applications/drafts');
    return response.data || [];
  } catch {
    return [];
  }
};

const saveDraftWithApi = async (draft: ApplicationDraft): Promise<void> => {
  if (draft.id) {
    await apiClient.put(`/applications/drafts/${draft.id}`, draft);
  } else {
    await apiClient.post('/applications/drafts', draft);
  }
};

const deleteDraftWithApi = async (draftId: string): Promise<void> => {
  await apiClient.delete(`/applications/drafts/${draftId}`);
};

const submitWithApi = async (
  draft: ApplicationDraft,
): Promise<{ id: string; status: string }> => {
  const response = await apiClient.post<any>('/applications/submit', {
    steps: draft.steps,
    selectedPrograms: draft.selectedPrograms,
  });
  return response.data;
};

const shouldUseMock = () => isMockApiEnabled;

export const applicationService = {
  async getDrafts(): Promise<ApplicationDraft[]> {
    return shouldUseMock()
      ? getDraftsWithMock()
      : getDraftsWithApi();
  },

  async saveDraft(draft: ApplicationDraft): Promise<void> {
    return shouldUseMock()
      ? saveDraftWithMock(draft)
      : saveDraftWithApi(draft);
  },

  async deleteDraft(draftId: string): Promise<void> {
    return shouldUseMock()
      ? deleteDraftWithMock(draftId)
      : deleteDraftWithApi(draftId);
  },

  async submit(draft: ApplicationDraft): Promise<{ id: string; status: string }> {
    return shouldUseMock()
      ? submitWithMock(draft)
      : submitWithApi(draft);
  },
};
