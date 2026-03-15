import { Box, Typography, Grid, Card, CardContent, TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Slider, InputAdornment, Chip, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// РАСШИРЕННЫЕ ДАННЫЕ ДЛЯ ДАУЛЕТА
const MOCK_UNIVERSITIES =[
  { 
    id: 1, 
    name: 'Каспийский университет технологий и инжиниринга', 
    city: 'Актау',
    program: 'B057 - Информационные технологии', 
    degree: 'Бакалавриат',
    duration: '4 года',
    language: 'KZ, RU',
    grants: 150, 
    score: 85 
  },
  { 
    id: 2, 
    name: 'Назарбаев Университет', 
    city: 'Астана',
    program: 'B059 - Компьютерные науки', 
    degree: 'Бакалавриат',
    duration: '4 года',
    language: 'EN',
    grants: 200, 
    score: 120 
  },
  { 
    id: 3, 
    name: 'Евразийский национальный университет', 
    city: 'Астана',
    program: 'B044 - Менеджмент и управление', 
    degree: 'Бакалавриат',
    duration: '4 года',
    language: 'KZ, RU',
    grants: 120, 
    score: 100 
  },
];

const GrantsCatalogPage = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* ЛЕВАЯ ПАНЕЛЬ ФИЛЬТРОВ */}
      <Box sx={{ width: 280, backgroundColor: '#fff', borderRight: '1px solid #E2E8F0', p: 4, display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 800, mb: 4 }}>Фильтры</Typography>
        
        <Typography sx={{ fontWeight: 700, color: '#4A5568', mb: 2 }}>Регион</Typography>
        <FormControlLabel control={<Checkbox sx={{ color: '#00C853', '&.Mui-checked': { color: '#00C853' } }} />} label="Актау" />
        <FormControlLabel control={<Checkbox sx={{ color: '#00C853', '&.Mui-checked': { color: '#00C853' } }} />} label="Астана" />
        <FormControlLabel control={<Checkbox sx={{ color: '#00C853', '&.Mui-checked': { color: '#00C853' } }} />} label="Алматы" />

        <Typography sx={{ fontWeight: 700, color: '#4A5568', mt: 4, mb: 2 }}>Предметы ЕНТ</Typography>
        <RadioGroup defaultValue="all">
          <FormControlLabel value="all" control={<Radio sx={{ '&.Mui-checked': { color: '#00C853' } }}/>} label="Все предметы" />
          <FormControlLabel value="fizmat" control={<Radio sx={{ '&.Mui-checked': { color: '#00C853' } }}/>} label="Физ-Мат" />
          <FormControlLabel value="biohim" control={<Radio sx={{ '&.Mui-checked': { color: '#00C853' } }}/>} label="Био-Хим" />
        </RadioGroup>

        <Typography sx={{ fontWeight: 700, color: '#4A5568', mt: 4, mb: 4 }}>Проходной балл</Typography>
        <Slider defaultValue={50} min={50} max={140} valueLabelDisplay="on" sx={{ color: '#00C853' }} />
      </Box>

      {/* ПРАВАЯ ЧАСТЬ (Сетка карточек) */}
      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 5 } }}>
        <Typography variant="h4" sx={{ color: '#1A2B56', fontWeight: 800, mb: 4 }}>Каталог грантов и ВУЗов</Typography>
        
        <TextField 
          fullWidth variant="outlined" placeholder="Найти специальность или ВУЗ..."
          sx={{ mb: 4, backgroundColor: '#fff', borderRadius: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#A0AEC0' }} /></InputAdornment> }}
        />

        <Typography sx={{ color: '#4A5568', mb: 3 }}>Найдено: {MOCK_UNIVERSITIES.length} программ</Typography>

        {/* РАСШИРЕННАЯ КАРТОЧКА ВУЗА */}
        <Grid container spacing={3}>
          {MOCK_UNIVERSITIES.map((uni) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={uni.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, backgroundColor: '#F5F7FA', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <SchoolIcon sx={{ color: '#1A2B56' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: '#1A2B56', fontWeight: 800, lineHeight: 1.2, mb: 0.5 }}>
                        {uni.program}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.2 }}>
                        {uni.name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Доп информация: Город, Срок */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 16, color: '#A0AEC0' }} />
                      <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>{uni.city}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#A0AEC0' }} />
                      <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>{uni.duration}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>• {uni.language}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#A0AEC0', display: 'block' }}>Проходной балл</Typography>
                      <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 800 }}>{uni.score}</Typography>
                    </Box>
                    <Chip label={`${uni.grants} грантов`} sx={{ backgroundColor: 'rgba(0,200,83,0.1)', color: '#00C853', fontWeight: 700, borderRadius: 1 }} />
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button fullWidth variant="contained" sx={{ backgroundColor: '#00C853', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A844' } }}>
                    Выбрать
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>
    </Box>
  );
};

export default GrantsCatalogPage;