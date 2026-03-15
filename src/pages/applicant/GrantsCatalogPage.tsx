import { Box, Typography, Grid, Card, CardContent, TextField, Button, Checkbox, FormControlLabel, Radio, RadioGroup, Slider, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';

// Заглушка (Моки) для карточек ВУЗов
const MOCK_UNIVERSITIES =[
  { id: 1, name: 'Каспийский университет технологий', program: 'Программная инженерия', grants: 150, score: 85 },
  { id: 2, name: 'Назарбаев Университет', program: 'Компьютерные науки', grants: 200, score: 120 },
  { id: 3, name: 'Евразийский национальный университет', program: 'Международные отношения', grants: 120, score: 100 },
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
        
        {/* Поиск */}
        <TextField 
          fullWidth variant="outlined" placeholder="Найти специальность или ВУЗ..."
          sx={{ mb: 4, backgroundColor: '#fff', borderRadius: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#A0AEC0' }} /></InputAdornment>,
          }}
        />

        <Typography sx={{ color: '#4A5568', mb: 3 }}>Найдено: {MOCK_UNIVERSITIES.length} университетов</Typography>

        {/* СЕТКА (Grid) */}
        <Grid container spacing={3}>
          {MOCK_UNIVERSITIES.map((uni) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={uni.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, backgroundColor: '#F5F7FA', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SchoolIcon sx={{ color: '#1A2B56' }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700, lineHeight: 1.2 }}>{uni.name}</Typography>
                  </Box>
                  <Typography sx={{ color: '#4A5568', mb: 2 }}>{uni.program}</Typography>
                  
                  <Box sx={{ backgroundColor: '#00C853', color: '#fff', display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 700, mb: 1 }}>
                    Выделено грантов: {uni.grants}
                  </Box>
                  <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Проходной балл: {uni.score}</Typography>
                </CardContent>
                
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button fullWidth variant="contained" sx={{ backgroundColor: '#00C853', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A844' } }}>
                    Подробнее
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