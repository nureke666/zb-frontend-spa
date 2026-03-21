import type { DocumentType } from './application.types';

export const WIZARD_STEP_LABELS = [
  'Личные данные',
  'Образование',
  'Выбор гранта',
  'Документы',
] as const;

export const ENT_SUBJECT_OPTIONS = [
  'Математика',
  'Физика',
  'Информатика',
  'Биология',
  'Химия',
  'География',
  'Всемирная история',
  'Иностранный язык',
];

export const REGION_OPTIONS = [
  { value: 'aktau', label: 'Актау' },
  { value: 'astana', label: 'Астана' },
  { value: 'almaty', label: 'Алматы' },
  { value: 'atyrau', label: 'Атырау' },
];

export const UNIVERSITY_OPTIONS = [
  {
    value: 'yessenov',
    label: 'Yessenov University',
    region: 'aktau',
    city: 'Актау',
  },
  {
    value: 'caspian-tech',
    label: 'Каспийский университет технологий и инжиниринга',
    region: 'aktau',
    city: 'Актау',
  },
  {
    value: 'nu',
    label: 'Назарбаев Университет',
    region: 'astana',
    city: 'Астана',
  },
  {
    value: 'enu',
    label: 'Евразийский национальный университет',
    region: 'astana',
    city: 'Астана',
  },
  {
    value: 'satbayev',
    label: 'Satbayev University',
    region: 'almaty',
    city: 'Алматы',
  },
  {
    value: 'kaznmu',
    label: 'Казахский национальный медицинский университет',
    region: 'almaty',
    city: 'Алматы',
  },
  {
    value: 'atyrau',
    label: 'Atyrau University',
    region: 'atyrau',
    city: 'Атырау',
  },
];

export const PROGRAM_OPTIONS = [
  {
    value: 'b057-software-engineering',
    label: 'Программная инженерия (B057)',
    university: 'yessenov',
  },
  {
    value: 'b057-it',
    label: 'Информационные технологии (B057)',
    university: 'caspian-tech',
  },
  {
    value: 'b059-computer-science',
    label: 'Компьютерные науки (B059)',
    university: 'nu',
  },
  {
    value: 'b044-management',
    label: 'Менеджмент и управление (B044)',
    university: 'enu',
  },
  {
    value: 'b064-oil-gas',
    label: 'Нефтегазовое дело (B064)',
    university: 'satbayev',
  },
  {
    value: 'b061-logistics',
    label: 'Логистика и supply chain (B061)',
    university: 'atyrau',
  },
  {
    value: 'b086-medicine',
    label: 'Общая медицина (B086)',
    university: 'kaznmu',
  },
];

export const REQUIRED_DOCUMENTS: Array<{
  type: DocumentType;
  label: string;
  description: string;
}> = [
  {
    type: 'ID_CARD',
    label: 'Удостоверение личности',
    description: 'Скан или фото лицевой стороны документа.',
  },
  {
    type: 'CERTIFICATE',
    label: 'Аттестат или справка об обучении',
    description: 'Подтверждение текущего статуса обучения или выпуска.',
  },
  {
    type: 'ENT_RESULT',
    label: 'Результаты ЕНТ',
    description: 'Файл с официальным результатом тестирования.',
  },
];
