import { apiClient, isMockApiEnabled } from '../../api/apiClient';
import type { CatalogProgram } from './catalog.types';
import { MOCK_CATALOG_PROGRAMS } from './catalogData';

export interface ProgramsResponse {
  content: CatalogProgram[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
}

export interface CatalogFilters {
  regions: string[];
  degrees: string[];
  languages: string[];
  minScore: number;
  maxScore: number;
}

const mapBackendProgramToFrontend = (backendProgram: any): CatalogProgram => {
  return {
    id: backendProgram.id,
    region: backendProgram.region || 'unknown',
    city: backendProgram.city,
    universityId: backendProgram.universityId,
    universityName: backendProgram.universityName,
    programCode: backendProgram.programCode,
    programName: backendProgram.programName,
    degree: backendProgram.degree,
    duration: backendProgram.duration,
    languages: Array.isArray(backendProgram.languages)
      ? backendProgram.languages
      : backendProgram.language || [],
    grantCount: backendProgram.grantCount,
    passingScore: backendProgram.passingScore,
    entProfile: 'all',
    profileSubjects: [],
  };
};

const getWithMock = async (
  search?: string,
  region?: string,
  minScore?: number,
  page = 0,
  limit = 20,
): Promise<ProgramsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...MOCK_CATALOG_PROGRAMS];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.programName.toLowerCase().includes(searchLower) ||
        p.programCode.toLowerCase().includes(searchLower) ||
        p.universityName.toLowerCase().includes(searchLower),
    );
  }

  if (region) {
    filtered = filtered.filter((p) => p.region === region);
  }

  if (minScore !== undefined) {
    filtered = filtered.filter((p) => p.passingScore >= minScore);
  }

  const start = page * limit;
  const end = start + limit;

  return {
    content: filtered.slice(start, end),
    page,
    limit,
    totalElements: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
};

const getWithApi = async (
  search?: string,
  region?: string,
  minScore?: number,
  page = 0,
  limit = 20,
): Promise<ProgramsResponse> => {
  const params: any = {
    page,
    limit,
  };

  if (search) {
    params.search = search;
  }

  if (region) {
    params.region = region;
  }

  if (minScore !== undefined) {
    params.minScore = minScore;
  }

  const response = await apiClient.get<any>('/catalog/programs', {
    params,
  });

  return {
    content: response.data.content.map(mapBackendProgramToFrontend),
    page: response.data.page,
    limit: response.data.limit,
    totalElements: response.data.totalElements,
    totalPages: response.data.totalPages,
  };
};

const getProgramWithMock = async (id: string): Promise<CatalogProgram> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const program = MOCK_CATALOG_PROGRAMS.find((p) => p.id === id);
  if (!program) {
    throw new Error('Программа не найдена');
  }

  return program;
};

const getProgramWithApi = async (id: string): Promise<CatalogProgram> => {
  const response = await apiClient.get<any>(`/catalog/programs/${id}`);
  return mapBackendProgramToFrontend(response.data);
};

const getRegionsWithMock = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const regions = new Set(MOCK_CATALOG_PROGRAMS.map((p) => p.region));
  return Array.from(regions).sort();
};

const getRegionsWithApi = async (): Promise<string[]> => {
  const response = await apiClient.get<string[]>('/catalog/regions');
  return response.data;
};

const getFiltersWithMock = async (): Promise<CatalogFilters> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const regions = new Set(MOCK_CATALOG_PROGRAMS.map((p) => p.region));
  const degrees = new Set(MOCK_CATALOG_PROGRAMS.map((p) => p.degree));
  const languages = new Set<string>();

  MOCK_CATALOG_PROGRAMS.forEach((p) => {
    p.languages.forEach((l) => languages.add(l));
  });

  const scores = MOCK_CATALOG_PROGRAMS.map((p) => p.passingScore);

  return {
    regions: Array.from(regions).sort(),
    degrees: Array.from(degrees),
    languages: Array.from(languages).sort(),
    minScore: Math.min(...scores),
    maxScore: Math.max(...scores),
  };
};

const getFiltersWithApi = async (): Promise<CatalogFilters> => {
  const response = await apiClient.get<any>('/catalog/filters');
  return response.data;
};

const shouldUseMockCatalog = () => isMockApiEnabled;

export const catalogService = {
  async getPrograms(
    search?: string,
    region?: string,
    minScore?: number,
    page = 0,
    limit = 20,
  ): Promise<ProgramsResponse> {
    return shouldUseMockCatalog()
      ? getWithMock(search, region, minScore, page, limit)
      : getWithApi(search, region, minScore, page, limit);
  },

  async getProgram(id: string): Promise<CatalogProgram> {
    return shouldUseMockCatalog()
      ? getProgramWithMock(id)
      : getProgramWithApi(id);
  },

  async getRegions(): Promise<string[]> {
    return shouldUseMockCatalog()
      ? getRegionsWithMock()
      : getRegionsWithApi();
  },

  async getFilters(): Promise<CatalogFilters> {
    return shouldUseMockCatalog()
      ? getFiltersWithMock()
      : getFiltersWithApi();
  },
};
