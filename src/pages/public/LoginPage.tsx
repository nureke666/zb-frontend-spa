import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SchoolIcon from '@mui/icons-material/School';
import {
  clearAuthError,
  loginUser,
} from '../../features/auth/authSlice';
import { authService } from '../../features/auth/authService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isAuthenticated, status, user } = useAppSelector(
    (state) => state.auth,
  );

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(authService.getDefaultRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(clearAuthError());

    try {
      const session = await dispatch(
        loginUser({
          identifier: identifier.trim(),
          password,
        }),
      ).unwrap();

      navigate(authService.getDefaultRoute(session.user.role), { replace: true });
    } catch {
      // Ошибка уже сохранена в store и показана в UI.
    }
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
            {error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : null}

            <Typography variant="body2" sx={{ mb: 1, color: '#4A5568', fontWeight: 600 }}>ИИН или Email (введи "admin" для админки)</Typography>
            <TextField
              fullWidth variant="outlined" placeholder="Введите ИИН или Email"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) {
                  dispatch(clearAuthError());
                }
              }}
              sx={{ mb: 3 }} required
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#4A5568', fontWeight: 600 }}>Пароль</Typography>
              <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', color: '#1A2B56', fontWeight: 600 }}>Забыли пароль?</Link>
            </Box>
            <TextField
              fullWidth variant="outlined" type={showPassword ? 'text' : 'password'} placeholder="Введите пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) {
                  dispatch(clearAuthError());
                }
              }}
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
