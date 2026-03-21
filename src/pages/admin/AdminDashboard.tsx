import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import { mapApiError } from '../../api/apiClient';
import { adminService } from '../../features/admin/adminData';
import type { AdminDashboardData } from '../../features/admin/admin.types';
import {
  formatAdminStatus,
  formatDate,
  getAdminStatusColors,
} from '../../utils/formatters';

const emptyDashboardData: AdminDashboardData = {
  summary: {
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pendingReview: 0,
    availableGrants: 0,
  },
  applicationsByRegion: [],
  entSubjects: [],
  recentApplications: [],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardData>(emptyDashboardData);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const nextDashboardData = await adminService.getDashboardData();

        if (isMounted) {
          setDashboardData(nextDashboardData);
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

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const kpiCards = useMemo(
    () => [
      {
        title: 'Всего заявок',
        value: dashboardData.summary.totalApplications,
        stat: `${dashboardData.summary.pendingReview} в обработке`,
        statColor: '#1A2B56',
        iconColor: '#3B82F6',
      },
      {
        title: 'Одобрено',
        value: dashboardData.summary.approved,
        stat: 'Готовы к зачислению',
        statColor: '#00C853',
        iconColor: '#10B981',
      },
      {
        title: 'Отклонено',
        value: dashboardData.summary.rejected,
        stat: 'Требуют обратной связи',
        statColor: '#EF4444',
        iconColor: '#EF4444',
      },
      {
        title: 'Свободных грантов',
        value: dashboardData.summary.availableGrants,
        stat: 'Остаток по текущему пулу',
        statColor: '#8B5CF6',
        iconColor: '#8B5CF6',
      },
    ],
    [dashboardData],
  );

  const handleSearchSubmit = () => {
    navigate(
      `/admin/applications${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`,
    );
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      await adminService.downloadApplicationsCsv();
    } finally {
      setIsExporting(false);
    }
  };

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
            Система управления
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          <Button
            startIcon={<DashboardIcon />}
            sx={{
              justifyContent: 'flex-start',
              color: '#fff',
              backgroundColor: 'rgba(255,255,255,0.1)',
              py: 1.5,
            }}
          >
            Обзор
          </Button>
          <Button
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('/admin/applications')}
            sx={{
              justifyContent: 'flex-start',
              color: '#A0AEC0',
              py: 1.5,
              '&:hover': { color: '#fff' },
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
          <TextField
            variant="outlined"
            placeholder="Поиск заявок, абитуриентов или программ..."
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            sx={{ width: { xs: '100%', md: 440 }, backgroundColor: '#fff', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleSearchSubmit}
              sx={{ textTransform: 'none', borderColor: '#CBD5E0', color: '#1A2B56' }}
            >
              Найти в реестре
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={() => void handleExport()}
              disabled={isExporting}
              sx={{
                backgroundColor: '#1A2B56',
                '&:hover': { backgroundColor: '#111D3D' },
                textTransform: 'none',
              }}
            >
              {isExporting ? 'Экспортируем...' : 'Экспорт CSV'}
            </Button>
            <IconButton>
              <NotificationsIcon sx={{ color: '#4A5568' }} />
            </IconButton>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', color: '#1A2B56' }}>
                AD
              </Typography>
            </Box>
          </Box>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : null}

        {isLoading ? (
          <Box
            sx={{
              minHeight: 420,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress sx={{ color: '#1A2B56' }} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {kpiCards.map((kpi) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.title}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0px 4px 12px rgba(0,0,0,0.02)',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}
                      >
                        {kpi.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: '#1A2B56', fontWeight: 800 }}
                        >
                          {kpi.value}
                        </Typography>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: `${kpi.iconColor}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AssignmentIcon sx={{ color: kpi.iconColor }} />
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: kpi.statColor,
                          fontWeight: 700,
                          mt: 2,
                          display: 'block',
                        }}
                      >
                        {kpi.stat}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    height: 400,
                  }}
                >
                  <CardContent
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: '#1A2B56', fontWeight: 700, mb: 3 }}
                    >
                      Заявки по регионам
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={dashboardData.applicationsByRegion}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E2E8F0"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#4A5568' }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#4A5568' }}
                          />
                          <RechartsTooltip cursor={{ fill: '#F1F5F9' }} />
                          <Bar
                            dataKey="count"
                            fill="#1A2B56"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E2E8F0',
                    boxShadow: 'none',
                    height: 400,
                  }}
                >
                  <CardContent
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: '#1A2B56', fontWeight: 700, mb: 1 }}
                    >
                      Популярные предметы ЕНТ
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.entSubjects}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${((percent || 0) * 100).toFixed(0)}%`
                            }
                            labelLine={false}
                          >
                            {dashboardData.entSubjects.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card
              sx={{
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                boxShadow: 'none',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: '#1A2B56', fontWeight: 700 }}
                  >
                    Последние заявки
                  </Typography>
                  <Button
                    onClick={() => navigate('/admin/applications')}
                    sx={{ textTransform: 'none' }}
                  >
                    Открыть реестр
                  </Button>
                </Box>
                <Stack spacing={2}>
                  {dashboardData.recentApplications.map((application) => {
                    const statusColors = getAdminStatusColors(application.status);

                    return (
                      <Box
                        key={application.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', md: 'center' },
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: 1.5,
                        }}
                      >
                        <Box>
                          <Typography sx={{ color: '#1A2B56', fontWeight: 700 }}>
                            {application.applicantName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096' }}>
                            {application.id} • {formatDate(application.createdAt)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#718096' }}>
                            {application.programNames.join(', ') || 'Программы не выбраны'}
                          </Typography>
                        </Box>
                        <Chip
                          label={formatAdminStatus(application.status)}
                          sx={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            fontWeight: 700,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
