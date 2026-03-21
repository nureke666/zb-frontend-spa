import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mapApiError } from '../../api/apiClient';
import { adminService } from '../../features/admin/adminData';
import type {
  AdminApplicationRecord,
  AdminApplicationStatus,
} from '../../features/admin/admin.types';
import {
  formatAdminStatus,
  formatDate,
  getAdminStatusColors,
  maskIin,
} from '../../utils/formatters';

const statusOptions: Array<{
  value: 'ALL' | AdminApplicationStatus;
  label: string;
}> = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'SUBMITTED', label: 'Подано' },
  { value: 'UNDER_REVIEW', label: 'На проверке' },
  { value: 'WAITING_DOCUMENTS', label: 'Ждут документы' },
  { value: 'APPROVED', label: 'Одобрено' },
  { value: 'REJECTED', label: 'Отклонено' },
];

const ApplicationsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchFromQuery = searchParams.get('search') ?? '';

  const [applications, setApplications] = useState<AdminApplicationRecord[]>([]);
  const [search, setSearch] = useState(searchFromQuery);
  const [statusFilter, setStatusFilter] = useState<'ALL' | AdminApplicationStatus>(
    'ALL',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] =
    useState<AdminApplicationRecord | null>(null);
  const [statusDraft, setStatusDraft] = useState<AdminApplicationStatus>('SUBMITTED');
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  useEffect(() => {
    setSearch(searchFromQuery);
  }, [searchFromQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      setIsLoading(true);
      setError('');

      try {
        const nextApplications = await adminService.listApplications();

        if (isMounted) {
          setApplications(nextApplications);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(mapApiError(loadError).message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === 'ALL' || application.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        [
          application.id,
          application.applicantName,
          application.email,
          application.iin,
          ...application.programNames,
          ...application.universityNames,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const handleOpenApplication = (application: AdminApplicationRecord) => {
    setSelectedApplication(application);
    setStatusDraft(application.status);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) {
      return;
    }

    setUpdatingStatusId(selectedApplication.id);
    setError('');

    try {
      const updatedApplication = await adminService.updateApplicationStatus(
        selectedApplication.id,
        statusDraft,
      );

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === updatedApplication.id ? updatedApplication : application,
        ),
      );
      setSelectedApplication(updatedApplication);
    } catch (updateError) {
      setError(mapApiError(updateError).message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await adminService.downloadApplicationsCsv(filteredApplications);
    } finally {
      setIsExporting(false);
    }
  };

  const pendingCount = applications.filter((application) =>
    ['SUBMITTED', 'UNDER_REVIEW', 'WAITING_DOCUMENTS'].includes(
      application.status,
    ),
  ).length;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Box
        sx={{
          width: 260,
          backgroundColor: '#1A2B56',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>
            GrantFlow CRM
          </Typography>
          <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
            Реестр заявок
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          <Button
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/admin')}
            sx={{
              justifyContent: 'flex-start',
              color: '#A0AEC0',
              py: 1.5,
              '&:hover': { color: '#fff' },
            }}
          >
            Обзор
          </Button>
          <Button
            startIcon={<AssignmentIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)',
              py: 1.5,
            }}
          >
            Заявки
          </Button>
          <Button
            startIcon={<SchoolIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: '#A0AEC0',
              py: 1.5,
              '&:hover': { color: '#fff' },
            }}
          >
            ВУЗы
          </Button>
          <Button
            startIcon={<BarChartIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: '#A0AEC0',
              py: 1.5,
              '&:hover': { color: '#fff' },
            }}
          >
            Отчеты
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}
            >
              Реестр заявок
            </Typography>
            <Typography sx={{ color: '#718096' }}>
              {applications.length} заявок в системе, {pendingCount} требуют внимания.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => void handleExport()}
            disabled={isExporting || filteredApplications.length === 0}
            sx={{
              backgroundColor: '#1A2B56',
              '&:hover': { backgroundColor: '#111D3D' },
              textTransform: 'none',
            }}
          >
            {isExporting ? 'Экспортируем...' : 'Экспорт CSV'}
          </Button>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Typography sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}>
                Подано заявок
              </Typography>
              <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                {applications.length}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Typography sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}>
                На проверке
              </Typography>
              <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <CardContent>
              <Typography sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}>
                Отфильтровано
              </Typography>
              <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                {filteredApplications.length}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Card
          sx={{
            borderRadius: 3,
            mb: 4,
            border: '1px solid #E2E8F0',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                placeholder="Поиск по ID, ИИН, ФИО, email или программе..."
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <Select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value as 'ALL' | AdminApplicationStatus,
                    )
                  }
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        <TableContainer
          component={Card}
          sx={{
            borderRadius: 3,
            border: '1px solid #E2E8F0',
            boxShadow: 'none',
            minHeight: 320,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                minHeight: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress sx={{ color: '#1A2B56' }} />
            </Box>
          ) : filteredApplications.length === 0 ? (
            <Box sx={{ p: 4 }}>
              <Typography sx={{ color: '#1A2B56', fontWeight: 700, mb: 1 }}>
                По текущим фильтрам ничего не найдено
              </Typography>
              <Typography sx={{ color: '#718096' }}>
                Измени поисковый запрос или сбрось фильтр по статусу.
              </Typography>
            </Box>
          ) : (
            <Table sx={{ minWidth: 760 }}>
              <TableHead sx={{ backgroundColor: '#F1F5F9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    ID заявки
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    Абитуриент
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    ИИН
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    Балл ЕНТ
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    Дата подачи
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#4A5568' }}>
                    Статус
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#4A5568' }}>
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => {
                  const statusColors = getAdminStatusColors(application.status);

                  return (
                    <TableRow key={application.id} hover>
                      <TableCell sx={{ fontWeight: 700, color: '#1A2B56' }}>
                        {application.id}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1A2B56' }}>
                          {application.applicantName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                          {application.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#4A5568' }}>
                        {maskIin(application.iin)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>
                        {application.entScore ?? '—'}
                      </TableCell>
                      <TableCell sx={{ color: '#4A5568' }}>
                        {formatDate(application.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatAdminStatus(application.status)}
                          size="small"
                          sx={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            fontWeight: 700,
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenApplication(application)}
                        >
                          <VisibilityOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>

      <Dialog
        open={Boolean(selectedApplication)}
        onClose={() => setSelectedApplication(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Карточка заявки</DialogTitle>
        {selectedApplication ? (
          <>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box>
                  <Typography sx={{ color: '#718096', mb: 0.5 }}>ФИО</Typography>
                  <Typography sx={{ color: '#1A2B56', fontWeight: 700 }}>
                    {selectedApplication.applicantName}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#718096', mb: 0.5 }}>
                    Контактные данные
                  </Typography>
                  <Typography>{selectedApplication.email}</Typography>
                  <Typography>{maskIin(selectedApplication.iin)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#718096', mb: 0.5 }}>
                    Академический профиль
                  </Typography>
                  <Typography>
                    Балл ЕНТ: {selectedApplication.entScore ?? '—'}
                  </Typography>
                  <Typography>
                    Профильные предметы:{' '}
                    {selectedApplication.profileSubjects.join(', ') || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#718096', mb: 0.5 }}>
                    Выбранные программы
                  </Typography>
                  <Typography>{selectedApplication.programNames.join(', ') || '—'}</Typography>
                  <Typography sx={{ color: '#718096' }}>
                    {selectedApplication.universityNames.join(', ') || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: '#718096', mb: 0.5 }}>
                    Документы
                  </Typography>
                  <Typography>
                    {selectedApplication.documentsCount} из{' '}
                    {selectedApplication.requiredDocumentsCount} обязательных файлов
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Typography sx={{ color: '#718096', mb: 1 }}>
                    Статус рассмотрения
                  </Typography>
                  <Select
                    value={statusDraft}
                    onChange={(event) =>
                      setStatusDraft(event.target.value as AdminApplicationStatus)
                    }
                  >
                    {statusOptions
                      .filter((option) => option.value !== 'ALL')
                      .map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#F8FAFC',
                    p: 2,
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <DescriptionOutlinedIcon sx={{ color: '#1A2B56' }} />
                  <Typography sx={{ color: '#4A5568' }}>
                    Источник данных: {selectedApplication.source === 'draft'
                      ? 'локальная заявка из applicant-flow'
                      : 'seed mock data'}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedApplication(null)}>Закрыть</Button>
              <Button
                variant="contained"
                onClick={() => void handleStatusUpdate()}
                disabled={updatingStatusId === selectedApplication.id}
                sx={{
                  backgroundColor: '#1A2B56',
                  '&:hover': { backgroundColor: '#111D3D' },
                  textTransform: 'none',
                }}
              >
                {updatingStatusId === selectedApplication.id
                  ? 'Сохраняем...'
                  : 'Сохранить статус'}
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
};

export default ApplicationsList;
