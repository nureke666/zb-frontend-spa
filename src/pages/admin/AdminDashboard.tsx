import { Box, Typography, Card, CardContent, Grid, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Моковые данные для графиков
const regionData =[
  { name: 'Алматы', count: 280 }, { name: 'Астана', count: 240 },
  { name: 'Шымкент', count: 180 }, { name: 'Караганда', count: 150 },
  { name: 'Актобе', count: 120 }, { name: 'Тараз', count: 90 },
];

const subjectData =[
  { name: 'Математика', value: 27, color: '#3B82F6' },
  { name: 'Физика', value: 21, color: '#8B5CF6' },
  { name: 'Информатика', value: 16, color: '#06B6D4' },
  { name: 'История', value: 13, color: '#10B981' },
  { name: 'Биология', value: 11, color: '#F59E0B' },
  { name: 'Химия', value: 11, color: '#EF4444' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* ЛЕВЫЙ САЙДБАР (Тёмно-синий) */}
      <Box sx={{ width: 260, backgroundColor: '#1A2B56', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>GrantFlow CRM</Typography>
          <Typography variant="body2" sx={{ color: '#A0AEC0' }}>Система управления</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          <Button startIcon={<DashboardIcon />} sx={{ justifyContent: 'flex-start', color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', py: 1.5 }}>Обзор</Button>
          <Button startIcon={<AssignmentIcon />} onClick={() => navigate('/admin/applications')} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>Заявки</Button>
          <Button startIcon={<SchoolIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>ВУЗы</Button>
          <Button startIcon={<BarChartIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>Отчеты</Button>
        </Box>
      </Box>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh' }}>
        
        {/* Шапка (Header) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <TextField 
            variant="outlined" 
            placeholder="Поиск заявок, абитуриентов, ВУЗов..." 
            size="small"
            sx={{ width: 400, backgroundColor: '#fff', borderRadius: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ backgroundColor: '#1A2B56', '&:hover': { backgroundColor: '#111D3D' }, textTransform: 'none' }}>
              Экспорт в Excel
            </Button>
            <IconButton><NotificationsIcon sx={{ color: '#4A5568' }}/></IconButton>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', color: '#1A2B56' }}>AD</Typography>
            </Box>
          </Box>
        </Box>

        {/* KPI Карточки */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: 'Всего заявок', value: '1,245', stat: '+12.5%', statColor: '#00C853', iconColor: '#3B82F6' },
            { title: 'Одобрено', value: '300', stat: '+8.3%', statColor: '#00C853', iconColor: '#10B981' },
            { title: 'Отклонено', value: '45', stat: '-3.2%', statColor: '#EF4444', iconColor: '#EF4444' },
            { title: 'Свободных грантов', value: '850', stat: '-15.8%', statColor: '#EF4444', iconColor: '#8B5CF6' }
          ].map((kpi, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
              <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 12px rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
                <CardContent>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600, mb: 1 }}>{kpi.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800 }}>{kpi.value}</Typography>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: `${kpi.iconColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AssignmentIcon sx={{ color: kpi.iconColor }} />
                    </Box>
                  </Box>
                  <Typography variant="caption" sx={{ color: kpi.statColor, fontWeight: 700, mt: 2, display: 'block' }}>
                    {kpi.stat} <span style={{ color: '#A0AEC0', fontWeight: 500 }}>за месяц</span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* ГРАФИКИ */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Столбчатая диаграмма */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: 400 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 3 }}>Заявки по регионам</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A5568' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A5568' }} />
                      <RechartsTooltip cursor={{ fill: '#F1F5F9' }} />
                      <Bar dataKey="count" fill="#1A2B56" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Круговая диаграмма */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: 400 }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, mb: 1 }}>Популярные предметы ЕНТ</Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={subjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value" 
                        label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} 
                        labelLine={false}
                      >
                        {subjectData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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

      </Box>
    </Box>
  );
};

export default AdminDashboard;