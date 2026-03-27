import { apiClient, isMockApiEnabled } from '../../api/apiClient';
import type { CatalogProgram } from './catalog.types';

export const MOCK_CATALOG_PROGRAMS = [
  {
    id: 'b057-software-engineering',
    region: 'aktau',
    city: 'Актау',
    universityId: 'yessenov',
    universityName: 'Yessenov University',
    programCode: 'B057',
    programName: 'Программная инженерия',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['KZ', 'RU'],
    grantCount: 150,
    passingScore: 85,
    entProfile: 'fizmat',
    profileSubjects: ['Математика', 'Физика'],
  },
  {
    id: 'b057-it',
    region: 'aktau',
    city: 'Актау',
    universityId: 'caspian-tech',
    universityName: 'Каспийский университет технологий и инжиниринга',
    programCode: 'B057',
    programName: 'Информационные технологии',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['KZ', 'RU'],
    grantCount: 120,
    passingScore: 80,
    entProfile: 'fizmat',
    profileSubjects: ['Математика', 'Информатика'],
  },
  {
    id: 'b059-computer-science',
    region: 'astana',
    city: 'Астана',
    universityId: 'nu',
    universityName: 'Назарбаев Университет',
    programCode: 'B059',
    programName: 'Компьютерные науки',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['EN'],
    grantCount: 200,
    passingScore: 120,
    entProfile: 'fizmat',
    profileSubjects: ['Математика', 'Физика'],
  },
  {
    id: 'b044-management',
    region: 'astana',
    city: 'Астана',
    universityId: 'enu',
    universityName: 'Евразийский национальный университет',
    programCode: 'B044',
    programName: 'Менеджмент и управление',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['KZ', 'RU'],
    grantCount: 120,
    passingScore: 100,
    entProfile: 'humanities',
    profileSubjects: ['География', 'Иностранный язык'],
  },
  {
    id: 'b064-oil-gas',
    region: 'almaty',
    city: 'Алматы',
    universityId: 'satbayev',
    universityName: 'Satbayev University',
    programCode: 'B064',
    programName: 'Нефтегазовое дело',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['KZ', 'RU'],
    grantCount: 150,
    passingScore: 110,
    entProfile: 'fizmat',
    profileSubjects: ['Математика', 'Физика'],
  },
  {
    id: 'b086-medicine',
    region: 'almaty',
    city: 'Алматы',
    universityId: 'kaznmu',
    universityName: 'Казахский национальный медицинский университет',
    programCode: 'B086',
    programName: 'Общая медицина',
    degree: 'Бакалавриат',
    duration: '6 лет',
    languages: ['KZ', 'RU'],
    grantCount: 90,
    passingScore: 115,
    entProfile: 'biohim',
    profileSubjects: ['Биология', 'Химия'],
  },
  {
    id: 'b061-logistics',
    region: 'atyrau',
    city: 'Атырау',
    universityId: 'atyrau',
    universityName: 'Atyrau University',
    programCode: 'B061',
    programName: 'Логистика и supply chain',
    degree: 'Бакалавриат',
    duration: '4 года',
    languages: ['KZ', 'RU'],
    grantCount: 70,
    passingScore: 92,
    entProfile: 'humanities',
    profileSubjects: ['География', 'Иностранный язык'],
  },
] as const satisfies readonly CatalogProgram[];

const delay = (ms = 250) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

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

const getMockPrograms = (): CatalogProgram[] => {
  return [...MOCK_CATALOG_PROGRAMS];
};

export const catalogService = {
  async listPrograms(): Promise<CatalogProgram[]> {
    if (isMockApiEnabled) {
      await delay();
      return getMockPrograms();
    }

    try {
      const response = await apiClient.get<any>('/catalog/programs', {
        params: { page: 0, limit: 1000 },
      });
      return response.data.content?.map(mapBackendProgramToFrontend) || [];
    } catch {
      // Fallback to mock data on error
      return getMockPrograms();
    }
  },

  async listProgramsWithFilters(
    search?: string,
    region?: string,
    minScore?: number,
    page = 0,
    limit = 20,
  ): Promise<any> {
    const params: any = { page, limit };

    if (search) params.search = search;
    if (region) params.region = region;
    if (minScore !== undefined) params.minScore = minScore;

    if (isMockApiEnabled) {
      await delay();

      let filtered = getMockPrograms();

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
    }

    try {
      const response = await apiClient.get<any>('/catalog/programs', { params });
      return {
        content: response.data.content?.map(mapBackendProgramToFrontend) || [],
        page: response.data.page,
        limit: response.data.limit,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      };
    } catch {
      return { content: [], page, limit, totalElements: 0, totalPages: 0 };
    }
  },

  async getProgram(id: string): Promise<CatalogProgram> {
    if (isMockApiEnabled) {
      await delay(200);
      const program = getMockPrograms().find((p) => p.id === id);
      if (!program) {
        throw new Error('Программа не найдена');
      }
      return program;
    }

    try {
      const response = await apiClient.get<any>(`/catalog/programs/${id}`);
      return mapBackendProgramToFrontend(response.data);
    } catch {
      throw new Error('Программа не найдена');
    }
  },

  async getRegions(): Promise<string[]> {
    if (isMockApiEnabled) {
      await delay(200);
      const regions = new Set(getMockPrograms().map((p) => p.region));
      return Array.from(regions).sort();
    }

    try {
      const response = await apiClient.get<string[]>('/catalog/regions');
      return response.data;
    } catch {
      const regions = new Set(getMockPrograms().map((p) => p.region));
      return Array.from(regions).sort();
    }
  },

  async getFilters(): Promise<any> {
    if (isMockApiEnabled) {
      await delay(200);

      const programs = getMockPrograms();
      const regions = new Set(programs.map((p) => p.region));
      const degrees = new Set(programs.map((p) => p.degree));
      const languages = new Set<string>();

      programs.forEach((p) => {
        p.languages.forEach((l) => languages.add(l));
      });

      const scores = programs.map((p) => p.passingScore);

      return {
        regions: Array.from(regions).sort(),
        degrees: Array.from(degrees),
        languages: Array.from(languages).sort(),
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
      };
    }

    try {
      const response = await apiClient.get<any>('/catalog/filters');
      return response.data;
    } catch {
      const programs = getMockPrograms();
      const regions = new Set(programs.map((p) => p.region));
      const degrees = new Set(programs.map((p) => p.degree));
      const languages = new Set<string>();

      programs.forEach((p) => {
        p.languages.forEach((l) => languages.add(l));
      });

      const scores = programs.map((p) => p.passingScore);

      return {
        regions: Array.from(regions).sort(),
        degrees: Array.from(degrees),
        languages: Array.from(languages).sort(),
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
      };
    }
  },
};
