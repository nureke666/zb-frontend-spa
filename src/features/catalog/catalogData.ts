import { apiClient, isMockApiEnabled } from '../../api/apiClient';
import type { CatalogProgram } from './catalog.types';

const MOCK_CATALOG_PROGRAMS: CatalogProgram[] = [
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
];

const delay = (ms = 250) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export const catalogService = {
  async listPrograms(): Promise<CatalogProgram[]> {
    if (isMockApiEnabled) {
      await delay();
      return MOCK_CATALOG_PROGRAMS;
    }

    const response = await apiClient.get<CatalogProgram[]>('/catalog/programs');
    return response.data;
  },
};

export { MOCK_CATALOG_PROGRAMS };
