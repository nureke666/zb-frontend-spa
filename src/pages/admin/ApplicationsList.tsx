import { Box, Typography, Card, CardContent, Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Select, MenuItem, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import BarChartIcon from '@mui/icons-material/BarChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';

// Моковые данные для таблицы
const applications =[
  { id: 'A-2024-1045', name: 'Нурбол Касымов', iin: '020415******', score: 125, date: '12.03.2026', status: 'Одобрен' },
  { id: 'A-2024-1044', name: 'Айгерим Сыздыкова', iin: '030822******', score: 118, date: '12.03.2026', status: 'На проверке' },
  { id: 'A-2024-1043', name: 'Диас Маратов', iin: '010510******', score: 95, date: '11.03.2026', status: 'Отклонен' },
  { id: 'A-2024-1042', name: 'Амина Серикова', iin: '040112******', score: 105, date: '11.03.2026', status: 'Одобрен' },
  { id: 'A-2024-1041', name: 'Тимур Болатов', iin: '021105******', score: 130, date: '10.03.2026', status: 'Ожидание' },
];

// Функция для цвета бейджей
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Одобрен': return { bg: '#E6F4EA', text: '#137333' };
    case 'На проверке': return { bg: '#FEF7E0', text: '#B06000' };
    case 'Отклонен': return { bg: '#FCE8E6', text: '#C5221F' };
    default: return { bg: '#F1F3F4', text: '#5F6368' };
  }
};

const ApplicationsList = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* ЛЕВЫЙ САЙДБАР */}
      <Box sx={{ width: 260, backgroundColor: '#1A2B56', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff' }}>GrantFlow CRM</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
          <Button startIcon={<DashboardIcon />} onClick={() => navigate('/admin')} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>Обзор</Button>
          <Button startIcon={<AssignmentIcon />} sx={{ justifyContent: 'flex-start', color: '#fff', backgroundColor: 'rgba(255,255,255,0.1)', py: 1.5 }}>Заявки</Button>
          <Button startIcon={<SchoolIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>ВУЗы</Button>
          <Button startIcon={<BarChartIcon />} sx={{ justifyContent: 'flex-start', color: '#A0AEC0', py: 1.5, '&:hover': { color: '#fff' } }}>Отчеты</Button>
        </Box>
      </Box>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto', height: '100vh' }}>
        
        <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, mb: 4 }}>Реестр заявок</Typography>

        {/* Панель фильтров */}
        <Card sx={{ borderRadius: 3, mb: 4, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 2 }}>
            <TextField 
              placeholder="Поиск по ИИН или ФИО..." 
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ width: 200 }}>
              <Select displayEmpty defaultValue="">
                <MenuItem value=""><em>Все статусы</em></MenuItem>
                <MenuItem value="Одобрен">Одобрен</MenuItem>
                <MenuItem value="На проверке">На проверке</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ color: '#4A5568', borderColor: '#E2E8F0' }}>
              Фильтры
            </Button>
          </CardContent>
        </Card>

        {/* ТАБЛИЦА */}
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#F1F5F9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>ID Заявки</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>ФИО Абитуриента</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>ИИН</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>Балл ЕНТ</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>Дата подачи</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#4A5568' }}>Статус</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#4A5568' }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: '#1A2B56' }}>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell sx={{ color: '#4A5568' }}>{row.iin}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.score}</TableCell>
                  <TableCell sx={{ color: '#4A5568' }}>{row.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(row.status).bg, 
                        color: getStatusColor(row.status).text,
                        fontWeight: 700, borderRadius: 1 
                      }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><MoreVertIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </Box>
  );
};

export default ApplicationsList;