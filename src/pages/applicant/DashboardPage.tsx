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
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #F5F7FA 0%, #E8F0F7 100%)' }}>
      
      {/* САЙДБАР С ГРАДИЕНТОМ */}
      <Box sx={{
        width: 260,
        background: `linear-gradient(180deg, #1A2B56 0%, #0F1B35 100%)`,
        color: '#fff',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(0, 182, 79, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }
      }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 6, position: 'relative', zIndex: 1, fontSize: '1.2rem' }}>
          Грант Портал
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, position: 'relative', zIndex: 1 }}>
          <Button startIcon={<DashboardIcon />} sx={{
            justifyContent: 'flex-start',
            color: '#00B64F',
            backgroundColor: 'rgba(0, 182, 79, 0.15)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 182, 79, 0.25)',
              transform: 'translateX(8px)',
              boxShadow: '0 4px 12px rgba(0, 182, 79, 0.3)'
            }
          }}>
            Главная
          </Button>
          <Button startIcon={<AssignmentIcon />} onClick={() => navigate('/apply')} sx={{
            justifyContent: 'flex-start',
            color: '#CBD5E0',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            '&:hover': {
              color: '#F0F4F8',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(8px)'
            }
          }}>
            Моя заявка
          </Button>
          <Button startIcon={<MenuBookIcon />} onClick={() => navigate('/catalog')} sx={{
            justifyContent: 'flex-start',
            color: '#CBD5E0',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            '&:hover': {
              color: '#F0F4F8',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(8px)'
            }
          }}>
            Каталог грантов
          </Button>
          <Button startIcon={<SettingsIcon />} sx={{
            justifyContent: 'flex-start',
            color: '#CBD5E0',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            '&:hover': {
              color: '#F0F4F8',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateX(8px)'
            }
          }}>
            Настройки
          </Button>
        </Box>
      </Box>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
        
        {/* ШАПКА */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          animation: 'slideInDown 0.6s ease'
        }}>
          <Box>
            <Typography variant="h5" sx={{
              color: '#1A2B56',
              fontWeight: 700,
              fontSize: '1.5rem'
            }}>
              Здравствуйте, {user?.firstName}!
            </Typography>
            <Chip
              label={statusLabel}
              color={lifecycleStatus === 'SUBMITTED' ? 'success' : lifecycleStatus === 'READY_TO_SUBMIT' ? 'warning' : 'default'}
              size="small"
              sx={{
                mt: 1,
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
            />
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)'
            }
          }}>
            <Typography sx={{ color: '#1A2B56', fontWeight: 600 }}>
              {user?.lastName} {user?.firstName}
            </Typography>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00B64F 0%, #0095D9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 182, 79, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}>
              {initials}
            </Box>
          </Box>
        </Box>

        {/* ТРЕКЕР СТАТУСА */}
        <Card sx={{
          mb: 4,
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          animation: 'slideInUp 0.6s ease 0.1s both',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)'
          }
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{
              color: '#1A2B56',
              fontWeight: 700,
              mb: 4
            }}>
              Статус вашей заявки
            </Typography>
            <ApplicationStatusTracker
              labels={[...WIZARD_STEP_LABELS]}
              completedSteps={completedSteps}
              activeStep={activeStep}
            />
          </CardContent>
        </Card>

        {/* ВИДЖЕТЫ */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ animation: 'slideInUp 0.6s ease 0.2s both' }}>
            <Card sx={{
              borderRadius: '16px',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: '1px solid rgba(0, 182, 79, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 182, 79, 0.15)',
                transform: 'translateY(-8px)',
                borderColor: 'rgba(0, 182, 79, 0.4)'
              }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 182, 79, 0.2) 0%, rgba(0, 182, 79, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 182, 79, 0.1)'
                }}>
                  <WorkspacePremiumIcon sx={{ color: '#00B64F', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Мои баллы ЕНТ</Typography>
                  <Typography variant="h3" sx={{ color: '#1A2B56', fontWeight: 800, my: 0.5 }}>
                    {draft.education.entScore || '—'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                    {profileSubjects ? `Профильные: ${profileSubjects}` : 'Профильные предметы еще не выбраны'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ animation: 'slideInUp 0.6s ease 0.3s both' }}>
            <Card sx={{
              borderRadius: '16px',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: '1px solid rgba(0, 100, 200, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 100, 200, 0.15)',
                transform: 'translateY(-8px)',
                borderColor: 'rgba(0, 100, 200, 0.4)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <EventIcon sx={{ color: '#0095D9', fontSize: 24 }} />
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Прогресс заявки</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>
                  {selectedDirectionsCount} из 4 направлений, {uploadedDocumentsCount} из {REQUIRED_DOCUMENTS.length} документов
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button fullWidth variant="contained" startIcon={<AssignmentIcon />} onClick={() => navigate('/apply')} sx={{
                    background: 'linear-gradient(135deg, #00B64F 0%, #00A844 100%)',
                    boxShadow: '0 4px 12px rgba(0, 182, 79, 0.3)',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 182, 79, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}>
                    {lifecycleStatus === 'EMPTY' ? 'Начать заявку' : 'Продолжить заявку'}
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<MenuBookIcon />} onClick={() => navigate('/catalog')} sx={{
                    color: '#1A2B56',
                    borderColor: '#CBD5E0',
                    borderWidth: '2px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#00B64F',
                      backgroundColor: 'rgba(0, 182, 79, 0.05)'
                    }
                  }}>
                    Открыть каталог
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ animation: 'slideInUp 0.6s ease 0.4s both' }}>
            <Card sx={{
              borderRadius: '16px',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: '1px solid rgba(0, 182, 79, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 182, 79, 0.15)',
                transform: 'translateY(-8px)',
                borderColor: 'rgba(0, 182, 79, 0.4)'
              }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 182, 79, 0.2) 0%, rgba(0, 182, 79, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 182, 79, 0.1)'
                }}>
                  <UploadFileIcon sx={{ color: '#00B64F', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Документы</Typography>
                  <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, my: 0.5 }}>
                    {uploadedDocumentsCount}/{REQUIRED_DOCUMENTS.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>
                    Загружены метаданные обязательных документов.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ animation: 'slideInUp 0.6s ease 0.5s both' }}>
            <Card sx={{
              borderRadius: '16px',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              border: '1px solid rgba(0, 100, 200, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 32px rgba(0, 100, 200, 0.15)',
                transform: 'translateY(-8px)',
                borderColor: 'rgba(0, 100, 200, 0.4)'
              }
            }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 3 }}>
                <Box sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.2) 0%, rgba(0, 100, 200, 0.05) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 100, 200, 0.1)'
                }}>
                  <SchoolIcon sx={{ color: '#0095D9', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Приоритеты</Typography>
                  <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, my: 0.5 }}>
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
