import { useState } from 'react';
import { Box, Typography, Card, CardContent, Stepper, Step, StepLabel, Button, FormControl, Select, MenuItem, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps =['Личные данные', 'Образование', 'Выбор гранта', 'Документы'];

const ApplyWizardPage = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const[university, setUniversity] = useState('');
  const [program, setProgram] = useState('');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F7FA', py: 6, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        
        {/* Горизонтальный Stepper */}
        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={2} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: '#00C853' }, '&.Mui-completed': { color: '#00C853' } } }}>
                  <Typography sx={{ fontWeight: 600, color: '#1A2B56' }}>{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h5" sx={{ color: '#1A2B56', fontWeight: 800, mb: 1 }}>
              Шаг 3: Выберите специальность и ВУЗ
            </Typography>
            <Typography sx={{ color: '#4A5568', mb: 4 }}>
              Вы можете выбрать до 4 направлений в порядке приоритета
            </Typography>

            {/* Поля формы */}
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A5568', mb: 1 }}>Регион обучения</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select value={region} onChange={(e) => setRegion(e.target.value as string)} displayEmpty>
                <MenuItem value="" disabled>Выберите регион</MenuItem>
                <MenuItem value="aktau">Актау</MenuItem>
                <MenuItem value="astana">Астана</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A5568', mb: 1 }}>Университет</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select value={university} onChange={(e) => setUniversity(e.target.value as string)} displayEmpty>
                <MenuItem value="" disabled>Выберите университет</MenuItem>
                <MenuItem value="yessenov">Каспийский университет (Yessenov)</MenuItem>
                <MenuItem value="nu">Назарбаев Университет</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4A5568', mb: 1 }}>Образовательная программа</Typography>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Select value={program} onChange={(e) => setProgram(e.target.value as string)} displayEmpty>
                <MenuItem value="" disabled>Выберите программу</MenuItem>
                <MenuItem value="it">Программная инженерия (B057)</MenuItem>
                <MenuItem value="oil">Нефтегазовое дело</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" fullWidth sx={{ color: '#00C853', borderColor: '#00C853', py: 1.5, mb: 6, '&:hover': { borderColor: '#00A844', backgroundColor: 'rgba(0,200,83,0.05)' } }}>
              + Добавить еще один ВУЗ
            </Button>

            <Divider sx={{ mb: 4 }} />

            {/* Кнопки Назад / Дальше */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => navigate(-1)} sx={{ color: '#4A5568', fontWeight: 600 }}>
                ← Назад
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#00C853', px: 4, py: 1.5, '&:hover': { backgroundColor: '#00A844' } }}>
                Сохранить и продолжить
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ApplyWizardPage;