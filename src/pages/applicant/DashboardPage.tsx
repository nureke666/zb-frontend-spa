import { Box, Typography, Card, CardContent, Grid, Button, Stepper, Step, StepLabel, Chip, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SettingsIcon from '@mui/icons-material/Settings';
import EventIcon from '@mui/icons-material/Event';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const steps =['Данные заполнены', 'ЕНТ подтверждено', 'На рассмотрении комиссии', 'Решение'];

const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      
      {/* СИНИЙ САЙДБАР */}
      <Box sx={{ width: 260, backgroundColor: '#1A2B56', color: '#fff', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 6 }}>Грант Портал</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button startIcon={<DashboardIcon />} sx={{ justifyContent: 'flex-start', color: '#00C853', backgroundColor: 'rgba(0,200,83,0.1)', '&:hover': { backgroundColor: 'rgba(0,200,83,0.2)' } }}>Главная</Button>
          <Button startIcon={<AssignmentIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Мои заявки</Button>
          <Button startIcon={<MenuBookIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Каталог грантов</Button>
          <Button startIcon={<SettingsIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0' }}>Настройки</Button>
        </Box>
      </Box>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {/* Шапка (Приветствие) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 700 }}>Здравствуйте, Азамат!</Typography>
            <Chip label="Ваша заявка в обработке" color="warning" size="small" sx={{ mt: 1, fontWeight: 600 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ color: '#1A2B56', fontWeight: 600 }}>Азамат Нурбеков</Typography>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#00C853', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>АН</Box>
          </Box>
        </Box>

        {/* ТРЕКЕР СТАТУСА (Stepper) */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 4 }}>Статус вашей заявки</Typography>
            <Stepper activeStep={2} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: '#1A2B56' }, '&.Mui-completed': { color: '#00C853' } } }}>
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
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
                  <Typography variant="h3" sx={{ color: '#1A2B56', fontWeight: 800 }}>115</Typography>
                  <Typography variant="body2" sx={{ color: '#A0AEC0' }}>Профильные: Математика, Физика</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3, height: '100%', boxShadow: 'none', border: '1px solid #E2E8F0' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EventIcon sx={{ color: '#4A5568' }} />
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Дедлайны</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 2 }}>
                  Осталось 5 дней до окончания приема документов
                </Typography>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#00C853', '&:hover': { backgroundColor: '#00A844' } }}>
                  Загрузить документ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;