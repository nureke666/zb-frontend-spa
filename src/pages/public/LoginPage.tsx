import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Link, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // <-- Добавили Redux
import { loginSuccess } from '../../features/auth/authSlice'; // <-- Добавили экшен логина
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <-- Инициализируем dispatch
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const[isLoading, setIsLoading] = useState(false); // Состояние загрузки

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Имитируем запрос на бэкенд (задержка 1.5 секунды)
    setTimeout(() => {
      // Проверяем, кто логинится
      const role = identifier.toLowerCase() === 'admin' ? 'ADMIN' : 'APPLICANT';
      const name = role === 'ADMIN' ? 'Администратор Фонда' : 'Азамат Нурбеков';

      // Отправляем данные в глобальный стейт Redux (сохраняем токен)
      dispatch(loginSuccess({
        user: { id: '1', name, role },
        token: 'fake-jwt-token-12345'
      }));

      setIsLoading(false);
      
      // Перекидываем на нужную страницу
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F7FA' }}>
      
      {/* Логотип */}
      <Box onClick={() => navigate('/')} sx={{ position: 'absolute', top: 24, left: 32, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
        <SchoolIcon sx={{ color: '#1A2B56', fontSize: 32 }} />
        <Typography variant="h6" sx={{ color: '#1A2B56', fontWeight: 700 }}>Zharqyn Bolashaq</Typography>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 440, borderRadius: 3, boxShadow: '0px 8px 24px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 5 }}>
          <Typography variant="h5" sx={{ textAlign: 'center', color: '#1A2B56', fontWeight: 700, mb: 4 }}>
            Вход в кабинет
          </Typography>

          <form onSubmit={handleLogin}>
            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>ИИН или Email (введи "admin" для админки)</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите ИИН или Email"
              value={identifier} onChange={(e) => setIdentifier(e.target.value)}
              sx={{ mb: 3 }} required
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Пароль</Typography>
              <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', color: '#1A2B56', fontWeight: 600 }}>Забыли пароль?</Link>
            </Box>
            <TextField
              fullWidth variant="outlined" type={showPassword ? 'text' : 'password'} placeholder="Введите пароль"
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }} required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={isLoading}
              sx={{ backgroundColor: '#00C853', py: 1.5, borderRadius: 2, fontSize: '1rem', textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#00A844' } }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;