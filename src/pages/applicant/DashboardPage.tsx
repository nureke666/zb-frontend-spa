import { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import ApplicationStatusTracker from '../../features/application/ApplicationStatusTracker';
import { REQUIRED_DOCUMENTS, WIZARD_STEP_LABELS } from '../../features/application/application.constants';
import {
  getCompletedStepIndexes,
  getLifecycleStatus,
  loadDraft,
} from '../../features/application/applicationDraft';
import { useAppSelector } from '../../store/hooks';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const draft = useMemo(() => loadDraft(user), [user]);
  const completedSteps = useMemo(() => getCompletedStepIndexes(draft), [draft]);
  const lifecycleStatus = useMemo(() => getLifecycleStatus(draft), [draft]);

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'С'
    : 'С';
  const profileSubjects = [draft.education.primarySubject, draft.education.secondarySubject]
    .filter(Boolean)
    .join(', ');
  const uploadedDocumentsCount = draft.documents.length;
  const selectedDirectionsCount = draft.grants.filter(
    (grant) => grant.region && grant.university && grant.program,
  ).length;
  const statusLabel =
    lifecycleStatus === 'SUBMITTED'
      ? 'Заявка отправлена'
      : lifecycleStatus === 'READY_TO_SUBMIT'
        ? 'Готово к отправке'
        : lifecycleStatus === 'DRAFT'
          ? 'Черновик сохранен'
          : 'Заявка не начата';
  const activeStep =
    lifecycleStatus === 'SUBMITTED'
      ? WIZARD_STEP_LABELS.length - 1
      : Math.min(completedSteps.length, WIZARD_STEP_LABELS.length - 1);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      
      {/* СИНИЙ САЙДБАР */}
      <Box sx={{ width: 260, backgroundColor: '#1A2B56', color: '#fff', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 6 }}>Грант Портал</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button startIcon={<DashboardIcon />} sx={{ justifyContent: 'flex-start', color: '#00C853', backgroundColor: 'rgba(0,200,83,0.1)', '&:hover': { backgroundColor: 'rgba(0,200,83,0.2)' } }}>Главная</Button>
          <Button startIcon={<AssignmentIcon />} onClick={() => navigate('/apply')} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Моя заявка</Button>
          <Button startIcon={<MenuBookIcon />} onClick={() => navigate('/catalog')} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Каталог грантов</Button>
          <Button startIcon={<SettingsIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Настройки</Button>
        </Box>
      </Box>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        
        {/* ДИНАМИЧЕСКАЯ ШАПКА ИЗ REDUX */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 700 }}>
              Здравствуйте, {user?.firstName}!
            </Typography>
            <Chip
              label={statusLabel}
              color={lifecycleStatus === 'SUBMITTED' ? 'success' : lifecycleStatus === 'READY_TO_SUBMIT' ? 'warning' : 'default'}
              size="small"
              sx={{ mt: 1, fontWeight: 600 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#1A2B56', fontWeight: 600 }}>
              {user?.lastName} {user?.firstName}
            </Typography>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {initials}
            </Box>
          </Box>
        </Box>

        {/* ТРЕКЕР СТАТУСА (Stepper) */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 4 }}>Статус вашей заявки</Typography>
            <ApplicationStatusTracker
              labels={[...WIZARD_STEP_LABELS]}
              completedSteps={completedSteps}
              activeStep={activeStep}
            />
          </CardContent>
        </Card>

        {/* ВИДЖЕТЫ */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <WorkspacePremiumIcon sx={{ color: '#00C853', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Мои баллы ЕНТ</Typography>
                  <Typography variant="h3" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                    {draft.education.entScore || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                    {profileSubjects ? `Профильные: ${profileSubjects}` : 'Профильные предметы еще не выбраны'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EventIcon sx={{ color: '#4A5568' }} />
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Прогресс заявки</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 2 }}>
                  {selectedDirectionsCount} из 4 направлений выбрано, {uploadedDocumentsCount} из {REQUIRED_DOCUMENTS.length} документов загружено
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button fullWidth variant="contained" startIcon={<AssignmentIcon />} onClick={() => navigate('/apply')} sx={{ backgroundColor: '#00C853', '&:hover': { backgroundColor: '#00A844' } }}>
                    {lifecycleStatus === 'EMPTY' ? 'Начать заявку' : 'Продолжить заявку'}
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<MenuBookIcon />} onClick={() => navigate('/catalog')} sx={{ color: '#1A2B56', borderColor: '#CBD5E0' }}>
                    Открыть каталог
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <UploadFileIcon sx={{ color: '#1A2B56', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Документы</Typography>
                  <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                    {uploadedDocumentsCount}/{REQUIRED_DOCUMENTS.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                    Загружены метаданные обязательных документов.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <SchoolIcon sx={{ color: '#1A2B56', fontSize: 40 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Приоритеты</Typography>
                  <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>
                    {selectedDirectionsCount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                    Направлений готово к отправке в заявке.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
