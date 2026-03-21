import type { AdminApplicationStatus } from '../features/admin/admin.types';

export const formatLanguages = (languages: string[]) => languages.join(', ');

export const formatDate = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsedDate);
};

export const maskIin = (iin?: string | null) => {
  if (!iin) {
    return '—';
  }

  if (iin.length <= 6) {
    return iin;
  }

  return `${iin.slice(0, 6)}******`;
};

export const formatAdminStatus = (status: AdminApplicationStatus) => {
  switch (status) {
    case 'APPROVED':
      return 'Одобрено';
    case 'REJECTED':
      return 'Отклонено';
    case 'UNDER_REVIEW':
      return 'На проверке';
    case 'WAITING_DOCUMENTS':
      return 'Ждут документы';
    case 'SUBMITTED':
    default:
      return 'Подано';
  }
};

export const getAdminStatusColors = (status: AdminApplicationStatus) => {
  switch (status) {
    case 'APPROVED':
      return { bg: '#E6F4EA', text: '#137333' };
    case 'REJECTED':
      return { bg: '#FCE8E6', text: '#C5221F' };
    case 'UNDER_REVIEW':
      return { bg: '#FEF7E0', text: '#B06000' };
    case 'WAITING_DOCUMENTS':
      return { bg: '#E8F0FE', text: '#1A73E8' };
    case 'SUBMITTED':
    default:
      return { bg: '#F1F3F4', text: '#5F6368' };
  }
};
